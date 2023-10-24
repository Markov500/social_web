import { animate, animation, sequence, style } from '@angular/animations';

export const flashAnimation = animation([
    sequence([
        animate('250ms', style({
            'background-color': 'rgb(80, 151, 251)'
        })),
        animate('250ms', style({
            'background-color': 'white'
        })),
    ]),
])