import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

type CadastroControlName = 'name' | 'email' | 'password' | 'confirmPassword';

interface CadastroField {
  name: CadastroControlName;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  autocomplete: string;
}

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  protected readonly submitted = signal(false);

  protected readonly cadastroFields = signal<readonly CadastroField[]>([
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Seu nome completo',
      autocomplete: 'name',
    },
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
      placeholder: 'Crie uma senha',
      autocomplete: 'new-password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar senha',
      type: 'password',
      placeholder: 'Repita a senha',
      autocomplete: 'new-password',
    },
  ]);

  protected readonly steps = signal<readonly string[]>([
    'Crie seu acesso inicial.',
    'Prepare sua operacao para acompanhar tudo pelo painel.',
  ]);

  protected readonly passwordRules = signal<readonly string[]>([
    'A senha deve ter pelo menos 6 caracteres.',
    'A confirmacao precisa ser igual a senha.',
  ]);

  protected readonly cadastroForm = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordsMatch },
  );

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      alert('Preencha os dados do cadastro corretamente.');
      return;
    }

    const { name, email } = this.cadastroForm.getRawValue();
    alert(`Cadastro enviado para ${name} (${email}).`);
  }

  protected hasError(controlName: CadastroControlName): boolean {
    const control = this.cadastroForm.controls[controlName];
    const hasPasswordMismatch =
      controlName === 'confirmPassword' && this.cadastroForm.hasError('passwordMismatch');

    return (control.invalid || hasPasswordMismatch) && (control.touched || this.submitted());
  }

  protected getErrorMessage(controlName: CadastroControlName): string {
    const control = this.cadastroForm.controls[controlName];

    if (control.hasError('required')) {
      return 'Campo obrigatorio.';
    }

    if (control.hasError('email')) {
      return 'Informe um e-mail valido.';
    }

    if (control.hasError('minlength')) {
      return controlName === 'name'
        ? 'Informe pelo menos 3 caracteres.'
        : 'A senha precisa ter no minimo 6 caracteres.';
    }

    if (controlName === 'confirmPassword' && this.cadastroForm.hasError('passwordMismatch')) {
      return 'As senhas precisam ser iguais.';
    }

    return '';
  }

}
