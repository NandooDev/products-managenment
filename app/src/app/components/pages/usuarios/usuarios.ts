import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { getApiErrorMessage } from '../../../services/api-error';
import {
  CreateUsuarioPayload,
  UpdateUsuarioPayload,
  Usuario,
  UsuarioService,
} from '../../../services/usuario.service';

type UsuarioControlName = 'nome' | 'email' | 'senha' | 'cpf';

interface UsuarioField {
  name: UsuarioControlName;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  autocomplete: string;
}

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly usuarioSelecionado = signal<Usuario | null>(null);
  protected readonly usuarioEmEdicao = signal<Usuario | null>(null);
  protected readonly usuarioFormAberto = signal(false);
  protected readonly submitted = signal(false);
  protected readonly carregandoUsuarios = signal(false);
  protected readonly erroUsuarios = signal<string | null>(null);

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
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text',
      placeholder: '000.000.000-00',
      autocomplete: 'off',
    },
    {
      name: 'senha',
      label: 'Senha',
      type: 'password',
      placeholder: 'Senha do usuario',
      autocomplete: 'new-password',
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
    senha: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cpf: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
      ],
    }),
  });

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  protected abrirDetalhes(usuario: Usuario): void {
    this.usuarioSelecionado.set(usuario);
  }

  protected fecharDetalhes(): void {
    this.usuarioSelecionado.set(null);
  }

  protected abrirCadastroUsuario(): void {
    this.usuarioSelecionado.set(null);
    this.usuarioEmEdicao.set(null);
    this.usuarioFormAberto.set(true);
    this.submitted.set(false);
    this.configurarValidadorSenha(true);
    this.usuarioForm.reset({
      nome: '',
      email: '',
      senha: '',
      cpf: '',
    });
  }

  protected abrirEdicao(usuario: Usuario): void {
    this.usuarioSelecionado.set(null);
    this.usuarioEmEdicao.set(usuario);
    this.usuarioFormAberto.set(true);
    this.submitted.set(false);
    this.configurarValidadorSenha(false);
    this.usuarioForm.reset({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      cpf: usuario.cpf,
    });
  }

  protected fecharEdicao(): void {
    this.usuarioEmEdicao.set(null);
    this.usuarioFormAberto.set(false);
    this.submitted.set(false);
  }

  protected salvarUsuario(): void {
    this.submitted.set(true);

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      alert('Preencha os dados do usuario corretamente.');
      return;
    }

    const usuarioAtual = this.usuarioEmEdicao();

    if (usuarioAtual) {
      const usuarioPayload = this.criarUsuarioUpdatePayload();

      this.usuarioService.atualizar(usuarioAtual.id, usuarioPayload).subscribe({
        next: (usuarioAtualizado) => {
          this.usuarios.update((usuarios) =>
            usuarios.map((usuario) =>
              usuario.id === usuarioAtual.id ? usuarioAtualizado : usuario,
            ),
          );
          this.fecharEdicao();
          alert(`Usuario ${usuarioAtualizado.nome} atualizado.`);
        },
        error: (error: unknown) => {
          alert(getApiErrorMessage(error, 'Nao foi possivel atualizar o usuario.'));
        },
      });
      return;
    }

    const usuarioPayload = this.criarUsuarioCreatePayload();

    this.usuarioService.criar(usuarioPayload).subscribe({
      next: (novoUsuario) => {
        this.usuarios.update((usuarios) => [novoUsuario, ...usuarios]);
        this.fecharEdicao();
        alert(`Usuario ${novoUsuario.nome} adicionado.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel cadastrar o usuario.'));
      },
    });
  }

  protected removerUsuario(usuario: Usuario): void {
    const deveRemover = confirm(`Remover o usuario ${usuario.nome}?`);

    if (!deveRemover) {
      return;
    }

    this.usuarioService.remover(usuario.id).subscribe({
      next: () => {
        this.usuarios.update((usuarios) => usuarios.filter((item) => item.id !== usuario.id));

        if (this.usuarioSelecionado()?.id === usuario.id) {
          this.fecharDetalhes();
        }

        if (this.usuarioEmEdicao()?.id === usuario.id) {
          this.fecharEdicao();
        }

        alert(`Usuario ${usuario.nome} removido.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel remover o usuario.'));
      },
    });
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

    if (control.hasError('pattern') && controlName === 'cpf') {
      return 'Informe 11 digitos para o CPF.';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'senha') {
        return 'A senha precisa ter no minimo 6 caracteres.';
      }

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

  private carregarUsuarios(): void {
    this.carregandoUsuarios.set(true);
    this.erroUsuarios.set(null);

    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
      },
      error: (error: unknown) => {
        this.erroUsuarios.set(getApiErrorMessage(error, 'Nao foi possivel carregar os usuarios.'));
        this.carregandoUsuarios.set(false);
      },
      complete: () => {
        this.carregandoUsuarios.set(false);
      },
    });
  }

  private configurarValidadorSenha(required: boolean): void {
    const validators = required
      ? [Validators.required, Validators.minLength(6)]
      : [Validators.minLength(6)];

    this.usuarioForm.controls.senha.setValidators(validators);
    this.usuarioForm.controls.senha.updateValueAndValidity({ emitEvent: false });
  }

  private criarUsuarioCreatePayload(): CreateUsuarioPayload {
    const { nome, email, senha, cpf } = this.usuarioForm.getRawValue();

    return {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
      cpf: cpf.trim(),
    };
  }

  private criarUsuarioUpdatePayload(): UpdateUsuarioPayload {
    const { nome, email, senha, cpf } = this.usuarioForm.getRawValue();
    const senhaLimpa = senha.trim();
    const payload: UpdateUsuarioPayload = {
      nome: nome.trim(),
      email: email.trim(),
      cpf: cpf.trim(),
    };

    if (senhaLimpa.length > 0) {
      payload.senha = senhaLimpa;
    }

    return payload;
  }
}
