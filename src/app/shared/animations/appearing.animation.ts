import { animate, animation, query, style } from "@angular/animations";

export const appearingAnimation = animation([
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
    'background-color': ' {{color}} ',
  }),
  animate('250ms ease-out', style({
    transform: 'translateX(0)',
    opacity: 1,
    'background-color': 'white',
  })),
])