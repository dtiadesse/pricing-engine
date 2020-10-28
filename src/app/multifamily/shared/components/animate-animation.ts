import { animate, state, style, transition, trigger } from '@angular/animations';

/** Time and timing curve for expand/collapse animations */
export const EXPANSION_ANIMATION_TIMING = '225ms cubic-bezier(0.4, 0.0, 0.2, 1)';

/** Animation that rotates the expansion indicator arrow */
export const expansionIndicatorRotate = trigger('expansionIndicatorRotate', [
    state('collapsed', style({ transform: 'rotate(0deg)' })),
    state('expanded', style({ transform: 'rotate(180deg)' })),
    transition('expanded <=> collapsed', animate(EXPANSION_ANIMATION_TIMING))
]);

/** Animation that expands and collapses the expansion content height */
export const expansionHeight = trigger('expansionHeight', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate(EXPANSION_ANIMATION_TIMING))
]);
