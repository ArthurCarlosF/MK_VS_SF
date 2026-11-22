/* Repeated basic inputs for the remaining roster. Native chain calibration pending. */
(function (scope) {
  'use strict';
  const characters = [];
  for (const [id, definition] of Object.entries(scope.FIGHT_DATA.characters)) {
    if (id === 'scorpion' || id === 'ryu') continue;
    const repeat = {};
    for (const [button, control] of Object.entries(definition.normalControls || {})) {
      const names = [...new Set([
        control.standing.near,
        control.standing.far,
        control.crouch,
        control.back
      ].filter(Boolean))];
      repeat[button] = names.filter(name => {
        const move = definition.moves[name];
        return move?.kind === 'strike' && !move.air && !move.grapple;
      });
    }
    definition.basicRepeat = repeat;
    definition.basicCombinations = [...new Set(Object.values(repeat).flat())];
    characters.push(id);
  }
  scope.ROSTER_SEQUENCE_STATUS = {
    characters,
    status: 'IMPLEMENTED_CALIBRATION_PENDING',
    policy: 'A fresh press of the same basic button reserves one continuation at full recovery.',
    limits: [
      'Per-character native rapid cancels, alternate hands and repeat windows require comparison.',
      'Only one continuation is reserved. Held buttons do not repeat.',
      'Mixed basic buttons link at full recovery. Native combo routes and cancel windows remain pending.',
      'Air attacks and specials remain separate.'
    ]
  };
})(typeof window === 'undefined' ? globalThis : window);
