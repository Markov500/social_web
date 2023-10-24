import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { confirmValidator } from '../../validators/confirm.validator';
@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {
  mainForm!: FormGroup;

  persInfoForm!: FormGroup;

  contactPrefCtrl!: FormControl;

  emailCtrl!: FormControl;
  emailConfCtrl!: FormControl;
  emailForm!: FormGroup;

  phoneCtrl!: FormControl;

  passwordCtrl!: FormControl;
  passwordConfCtrl!: FormControl;
  loginInfoForm!: FormGroup;


  showPhoneCard$!: Observable<boolean>;
  showMailCard$!: Observable<boolean>;

  loading = false;
  constructor(private formBuilder: FormBuilder, private complexFormService: ComplexFormService) { }
  emailConfirmError$!: Observable<boolean>;
  passwordConfirmError$!: Observable<boolean>;

  private initMainForm() {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.persInfoForm,
      contactPreference: this.contactPrefCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });

  }

  private initForms() {
    this.persInfoForm = this.formBuilder.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required]
    });

    this.contactPrefCtrl = this.formBuilder.control("email");

    this.emailCtrl = this.formBuilder.control("");
    this.emailConfCtrl = this.formBuilder.control("");
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.emailConfCtrl,
    }, {
      validators: [confirmValidator('email', "confirm")]
    });

    this.phoneCtrl = this.formBuilder.control('');

    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.passwordConfCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.passwordConfCtrl,
    }, {
      validators: [confirmValidator('password', 'confirmPassword')]
    })
  }

  private initObersvables() {
    this.showMailCard$ = this.contactPrefCtrl.valueChanges.pipe(
      startWith(this.contactPrefCtrl.value),
      map(pref => pref === 'email'),
      tap(showMailCtrl => {
        this.manageEmailValidators(showMailCtrl);
      })
    );


    this.showPhoneCard$ = this.contactPrefCtrl.valueChanges.pipe(
      startWith(this.contactPrefCtrl.value),
      map(pref => pref === 'phone'),
      tap(showPhoneCtrl => {
        this.managePhoneValidators(showPhoneCtrl);
      })
    );


    this.emailConfirmError$ = this.emailForm.statusChanges.pipe(
      map(v => v === "INVALID" && this.emailCtrl.value != "" && this.emailConfCtrl.value != "" && this.emailForm.hasError('confirmError'))
    );

    this.passwordConfirmError$ = this.loginInfoForm.statusChanges.pipe(
      map(v => v === "INVALID" && this.passwordCtrl.value != "" && this.passwordConfCtrl.value != "" && this.loginInfoForm.hasError('confirmError'))
    )

  }

  private manageEmailValidators(showMail: boolean) {
    if (showMail) {
      this.emailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
      this.emailConfCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
    } else {
      this.emailCtrl.clearValidators();
      this.emailConfCtrl.clearValidators();
      this.emailConfCtrl.reset();
      this.emailCtrl.reset();
    }
    this.emailCtrl.updateValueAndValidity();
    this.emailConfCtrl.updateValueAndValidity();
  }

  private managePhoneValidators(showPhone: boolean) {
    if (showPhone) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    } else {
      this.phoneCtrl.clearValidators();
      this.phoneCtrl.reset();
    }
    this.phoneCtrl.updateValueAndValidity();
  }
  ngOnInit(): void {
    this.initForms();
    this.initMainForm();
    this.initObersvables();
  }

  getErrorMessage(ctrl: AbstractControl): string {
    if (ctrl.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (ctrl.hasError('email')) {
      return "L'adresse mail est invalide"
    } else if (ctrl.hasError('minlength')) {
      return "Il manque quelques caratères"
    } else if (ctrl.hasError('maxlength')) {
      return "Il y ' a trop de caractères"
    }
    else {
      return 'Ce champ contient une erreur';
    }
  }
  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap((saved) => {
        this.loading = false;
        if (saved) {
          this.mainForm.reset();
          this.contactPrefCtrl.patchValue('email');
        }
        else {
          alert("Echec de l'inscription !!!");
        }
      })
    ).subscribe();
  }
}
