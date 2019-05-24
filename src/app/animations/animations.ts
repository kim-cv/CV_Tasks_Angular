import {
    trigger,
    animate,
    transition,
    style,
    state,
    query,
    stagger
} from '@angular/animations';



export const simpleFadeAnimation = trigger('simpleFadeAnimation', [
    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({ opacity: 1 })),

    transition(':enter', [
        style({ opacity: 0 }),
        animate(350)
    ]),

    transition(':leave',
        animate(350, style({ opacity: 0 }))
    )
]);

export const listAnimation = trigger('listAnimation', [
    transition('* => *', [ // each time the binding value changes
        query(':enter', [
            style({ opacity: 0 }),
            stagger(250, [
                style({ transform: 'scale(0)', opacity: 0 }),
                animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({
                        transform: 'scale(1)', opacity: 1
                    }))
            ])
        ], { optional: true }),

        query(':leave', [
            style({ opacity: 1, height: '*' }),
            animate(350, style({ opacity: 0, height: '0px', }))
        ], { optional: true })
    ])
]);
