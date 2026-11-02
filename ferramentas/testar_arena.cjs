const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict');
const {pathToFileURL} = require('url');
const {chromium} = require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const sandbox = {window: {}}; vm.createContext(sandbox);
for (const f of ['arena/assets.js', 'arena/engine.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox);
const {MovementArena, ARENA_RULES: rules, ARENA_ASSETS} = sandbox.window;
const bank = ARENA_ASSETS.characters, passed = [];
function test(name, f) { f(); passed.push(name); }
function run(g, seconds, input) {for (let i = 0; i < Math.round(seconds * 240); i++) g.step(1 / 240, input);}
function invariant(g) {
  const [a, b] = g.players, eps = 1e-7;
  assert(a.x >= rules.edge - eps && b.x <= rules.width - rules.edge + eps);
  assert(b.x - a.x >= rules.minimumDistance - eps && b.x - a.x <= rules.maximumDistance + eps);
  for (const p of [a, b]) assert(Math.abs(p.x - g.camera) <= rules.viewport / 2 - 35 + eps);
}
test('Independent original sample clocks', () => {
  const g = new MovementArena(bank); run(g, 1, [0, 0]);
  assert.equal(g.players[0].motionTick, 53); assert.equal(g.players[1].motionTick, 59);
  assert.equal(g.players[0].x, 440); assert.equal(g.players[1].x, 660);
});
test('Measured Scorpion forward and backward steps', () => {
  for (const [direction, step] of [[1, 3.25], [-1, -2.25]]) {
    const g = new MovementArena(bank); run(g, .25, [direction, 0]);
    assert.equal(g.players[0].x, 440 + 13 * step);
    assert.equal(g.players[0].state, direction === 1 ? 'forward' : 'backward');
  }
});
test('Ryu Turbo step sequence and reversed facing', () => {
  const g = new MovementArena(bank); run(g, .25, [0, -1]);
  const steps = bank.ryu.clips.forward.steps;
  assert.equal(g.players[1].x, 660 - steps.slice(0, 14).reduce((a, b) => a + b, 0));
  assert.equal(g.players[1].state, 'forward');
  const reverse = new MovementArena(bank, ['ryu', 'scorpion']); run(reverse, .25, [1, 1]);
  assert.equal(reverse.players[0].state, 'forward'); assert.equal(reverse.players[1].state, 'backward');
});
test('Stationary opponent is not pushed; characters cannot cross', () => {
  const g = new MovementArena(bank); run(g, 5, [1, 0]);
  assert.equal(g.players[1].x, 660); assert.equal(g.snapshot().distance, 50); invariant(g);
});
test('Both players approaching and maximum separation', () => {
  const g = new MovementArena(bank); run(g, 5, [1, -1]); assert.equal(g.snapshot().distance, 50);
  run(g, 5, [-1, 1]); assert.equal(g.snapshot().distance, 350); invariant(g);
});
test('Both arena boundaries and camera tracking', () => {
  const g = new MovementArena(bank); run(g, 25, [1, 1]);
  assert.equal(g.players[1].x, 1060); assert.equal(g.camera, 860); invariant(g);
  run(g, 25, [-1, -1]); assert.equal(g.players[0].x, 40); assert.equal(g.camera, 240); invariant(g);
});
test('Seeded mixed input invariants in both matchup orders', () => {
  let seed = 49242; const next = () => {seed = (1664525 * seed + 1013904223) >>> 0; return seed;};
  for (const ids of [['scorpion', 'ryu'], ['ryu', 'scorpion']]) {
    const g = new MovementArena(bank, ids); let input = [0, 0];
    for (let i = 0; i < 48000; i++) {if (i % 100 === 0) input = [next() % 3 - 1, next() % 3 - 1]; g.step(1/240, input); invariant(g);}
  }
});
test('Native copied sprites all exist', () => {
  for (const c of Object.values(bank)) for (const a of Object.values(c.assets)) assert(fs.existsSync(path.join(root, 'arena', a.file)));
});
test('Simulation is independent of display refresh rate', () => {
  const results = [30, 60, 144].map(hz => {
    const g = new MovementArena(bank); let acc = 0;
    for (let frame = 0; frame < hz; frame++) {
      acc += 1 / hz;
      while (acc + 1e-10 >= rules.step) {g.step(rules.step, [1, 0]); acc -= rules.step;}
    }
    return JSON.stringify(g.snapshot());
  });
  assert.equal(results[0], results[1]); assert.equal(results[1], results[2]);
});

// The old movement-only browser checks were superseded by the combat suite.
console.log(JSON.stringify({status:'PASS',movement_regressions:passed.length,passed},null,2));
require('./testar_interface_combate.cjs');
