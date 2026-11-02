/* One proportional sprite scale per universe, shared by its entire roster.
 * SF2: 96 native pixels * 1.25 = 120, versus Scorpion's ~128 in guard.
 * A common foot anchor preserves pose differences instead of equalizing heads.
 */
window.ARENA_PRESENTATION = Object.freeze({
  universeScale: Object.freeze({mk: 1, sf: 1.25})
});
