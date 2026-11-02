/* Pure simulation: seconds, native world units, and separate character clocks. */
(function (scope) {
  'use strict';
  const RULES = Object.freeze({width: 1100, viewport: 480, edge: 40,
    minimumDistance: 50, maximumDistance: 350, cameraMargin: 40, step: 1 / 240});
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  class MovementArena {
    constructor(bank, ids = ['scorpion', 'ryu']) {
      if (ids.length !== 2 || new Set(ids).size !== 2 || ids.some(id => !bank[id]))
        throw new Error('A arena atual requer Ryu e Scorpion.');
      this.bank = bank; this.ids = ids; this.reset();
    }
    reset() {
      this.players = this.ids.map((id, i) => ({id, x: i ? 660 : 440,
        facing: i ? -1 : 1, state: 'idle', frame: 0, motionTick: 0, clock: 0,
        blocked: false}));
      this.camera = 550; this.elapsed = 0;
    }
    step(dt, inputs = [0, 0]) {
      if (!(dt > 0 && dt <= .05)) throw new Error('Invalid simulation step');
      const old = this.players.map(p => p.x), next = [...old], attempted = [false, false];
      this.players.forEach((p, i) => {
        const dir = Math.sign(inputs[i] || 0);
        p.facing = i ? -1 : 1;
        const state = dir ? (dir === p.facing ? 'forward' : 'backward') : 'idle';
        if (p.state !== state) {
          p.state = state; p.frame = 0; p.motionTick = 0; p.clock = 0;
        }
        const c = this.bank[p.id], clip = c.clips[state];
        p.clock += dt;
        while (p.clock + 1e-10 >= 1 / c.fps) {
          p.clock -= 1 / c.fps;
          if (dir) {
            attempted[i] = true;
            next[i] += dir * clip.steps[p.motionTick % clip.steps.length];
          }
          p.motionTick++;
          p.frame = (p.frame + 1) % clip.frames.length;
        }
        next[i] = clamp(next[i], RULES.edge, RULES.width - RULES.edge);
      });
      // Resolve both players' proposals together; a stationary player is not
      // pushed and simultaneous approaches do not favor one update order.
      const delta = next.map((x, i) => x - old[i]);
      let gap = next[1] - next[0];
      if (gap < RULES.minimumDistance) {
        const a = Math.max(0, delta[0]), b = Math.max(0, -delta[1]);
        if (a + b > 0) {
          const correction = RULES.minimumDistance - gap;
          next[0] -= correction * a / (a + b);
          next[1] += correction * b / (a + b);
        }
      }
      gap = next[1] - next[0];
      if (gap > RULES.maximumDistance) {
        const a = Math.max(0, -delta[0]), b = Math.max(0, delta[1]);
        if (a + b > 0) {
          const correction = gap - RULES.maximumDistance;
          next[0] += correction * a / (a + b);
          next[1] -= correction * b / (a + b);
        }
      }
      this.players.forEach((p, i) => {
        if (p.state === 'idle') p.blocked = false;
        else if (attempted[i]) p.blocked = Math.abs(next[i] - old[i]) < 1e-8;
        p.x = next[i];
      });
      const half = RULES.viewport / 2, target = (next[0] + next[1]) / 2;
      const lo = Math.max(half, next[1] - half + RULES.cameraMargin);
      const hi = Math.min(RULES.width - half, next[0] + half - RULES.cameraMargin);
      this.camera = clamp(this.camera + (target - this.camera) * (1 - Math.exp(-8 * dt)), lo, hi);
      this.elapsed += dt;
    }
    snapshot() {
      return {players: this.players.map(p => ({...p})), camera: this.camera,
        distance: this.players[1].x - this.players[0].x, elapsed: this.elapsed};
    }
  }
  scope.MovementArena = MovementArena; scope.ARENA_RULES = RULES;
})(typeof window === 'undefined' ? globalThis : window);
