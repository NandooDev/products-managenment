import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type UsuarioControlName = 'nome' | 'email';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
}

interface UsuarioField {
  name: UsuarioControlName;
  label: string;
  type: 'text' | 'email';
  placeholder: string;
  autocomplete: string;
}

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  protected readonly usuarios = signal<Usuario[]>([
    {
      id: 1,
      nome: 'Marina Costa',
      email: 'marina.costa@empresa.com',
      senha: 'Marina@123',
      cpf: '123.456.789-10',
    },
    {
      id: 2,
      nome: 'Rafael Almeida',
      email: 'rafael.almeida@empresa.com',
      senha: 'Rafael@123',
      cpf: '234.567.891-01',
    },
    {
      id: 3,
      nome: 'Bianca Rocha',
      email: 'bianca.rocha@empresa.com',
      senha: 'Bianca@123',
      cpf: '345.678.912-02',
    },
    {
      id: 4,
      nome: 'Lucas Pereira',
      email: 'lucas.pereira@empresa.com',
      senha: 'Lucas@123',
      cpf: '456.789.123-03',
    },
    {
      id: 5,
      nome: 'Camila Santos',
      email: 'camila.santos@empresa.com',
      senha: 'Camila@123',
      cpf: '567.891.234-04',
    },
    {
      id: 6,
      nome: 'Thiago Nunes',
      email: 'thiago.nunes@empresa.com',
      senha: 'Thiago@123',
      cpf: '678.912.345-05',
    },
  ]);

  protected readonly usuarioSelecionado = signal<Usuario | null>(null);
  protected readonly usuarioEmEdicao = signal<Usuario | null>(null);
  protected readonly submitted = signal(false);

  protected readonly usuarioFields = signal<readonly UsuarioField[]>([
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Nome completo',
      autocomplete: 'name',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'usuario@empresa.com',
      autocomplete: 'email',
    },
  ]);

  protected readonly resumoUsuarios = computed(() => [
    {
      label: 'Usuarios',
      valor: this.usuarios().length.toString(),
    },
    {
      label: 'E-mails',
      valor: new Set(this.usuarios().map((usuario) => usuario.email)).size.toString(),
    },
    {
      label: 'CPFs',
      valor: new Set(this.usuarios().map((usuario) => usuario.cpf)).size.toString(),
    },
  ]);

  protected readonly usuarioForm = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected abrirDetalhes(usuario: Usuario): void {
    this.usuarioSelecionado.set(usuario);
  }

  protected fecharDetalhes(): void {
    this.usuarioSelecionado.set(null);
  }

  protected abrirEdicao(usuario: Usuario): void {
    this.usuarioSelecionado.set(null);
    this.usuarioEmEdicao.set(usuario);
    this.submitted.set(false);
    this.usuarioForm.reset({
      nome: usuario.nome,
      email: usuario.email,
    });
  }

  protected fecharEdicao(): void {
    this.usuarioEmEdicao.set(null);
    this.submitted.set(false);
  }

  protected salvarEdicao(): void {
    this.submitted.set(true);

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      alert('Preencha os dados do usuario corretamente.');
      return;
    }

    const usuarioAtual = this.usuarioEmEdicao();

    if (!usuarioAtual) {
      return;
    }

    const { nome, email } = this.usuarioForm.getRawValue();
    const usuarioAtualizado: Usuario = {
      ...usuarioAtual,
      nome,
      email,
    };

    this.usuarios.update((usuarios) =>
      usuarios.map((usuario) => (usuario.id === usuarioAtual.id ? usuarioAtualizado : usuario)),
    );
    this.usuarioEmEdicao.set(null);
    this.submitted.set(false);

    alert(`Usuario ${usuarioAtualizado.nome} atualizado.`);
  }

  protected removerUsuario(usuario: Usuario): void {
    const deveRemover = confirm(`Remover o usuario ${usuario.nome}?`);

    if (!deveRemover) {
      return;
    }

    this.usuarios.update((usuarios) => usuarios.filter((item) => item.id !== usuario.id));

    if (this.usuarioSelecionado()?.id === usuario.id) {
      this.fecharDetalhes();
    }

    if (this.usuarioEmEdicao()?.id === usuario.id) {
      this.fecharEdicao();
    }

    alert(`Usuario ${usuario.nome} removido.`);
  }

  protected hasError(controlName: UsuarioControlName): boolean {
    const control = this.usuarioForm.controls[controlName];

    return control.invalid && (control.touched || this.submitted());
  }

  protected getErrorMessage(controlName: UsuarioControlName): string {
    const control = this.usuarioForm.controls[controlName];

    if (control.hasError('required')) {
      return 'Campo obrigatorio.';
    }

    if (control.hasError('email')) {
      return 'Informe um e-mail valido.';
    }

    if (control.hasError('minlength')) {
      return 'Informe pelo menos 3 caracteres.';
    }

    return '';
  }

  protected getInitials(nome: string): string {
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('');
  }
}
