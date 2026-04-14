import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LoginControlName = 'email' | 'password';

interface LoginField {
  name: LoginControlName;
  label: string;
  type: 'email' | 'password';
  placeholder: string;
  autocomplete: string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly submitted = signal(false);

  protected readonly loginFields = signal<readonly LoginField[]>([
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'seuemail@empresa.com',
      autocomplete: 'email',
    },
    {
      name: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      autocomplete: 'current-password',
    },
  ]);

  protected readonly highlights = signal<readonly string[]>([
    'Acesse seu painel de produtos em segundos.',
    'Continue de onde parou sem configurar nada de novo.',
  ]);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      alert('Preencha os dados de login corretamente.');
      return;
    }

    const { email } = this.loginForm.getRawValue();
    alert(`Login enviado para ${email}.`);
  }

  protected hasError(controlName: LoginControlName): boolean {
    const control = this.loginForm.controls[controlName];

    return control.invalid && (control.touched || this.submitted());
  }

  protected getErrorMessage(controlName: LoginControlName): string {
    const control = this.loginForm.controls[controlName];

    if (control.hasError('required')) {
      return 'Campo obrigatorio.';
    }

    if (control.hasError('email')) {
      return 'Informe um e-mail valido.';
    }

    if (control.hasError('minlength')) {
      return 'A senha precisa ter no minimo 6 caracteres.';
    }

    return '';
  }

}
