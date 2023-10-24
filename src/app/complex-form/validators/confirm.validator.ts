import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmValidator(main: string, confirm: string): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
        if (!ctrl.get(main) || !ctrl.get(confirm)) {
            return {
                confirmError: "Au moins un des attributs est inexistant"
            }
        }

        return ctrl.get(main)?.value === ctrl.get(confirm)?.value
            ? null
            : {
                confirmError: {
                    main,
                    confirm
                }
            }

    }
}