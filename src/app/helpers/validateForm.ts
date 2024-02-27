// make it method global, no DRY
import { FormControl, FormGroup } from "@angular/forms";

export default class ValidateForm{
    static validateAllFormFields(formGroup: FormGroup){
        Object.keys(formGroup.controls).forEach(field=>{
          const control = formGroup.get(field);
    
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf: true}) // we make it dirty so, any error in input will show since we put condition --> *ngIf="loginForm.controls['password'].dirty && loginForm.hasError('required', 'password')"
          }
          else if(control instanceof FormGroup){
            this.validateAllFormFields(control)
          }
        })
      }
}