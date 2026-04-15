import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { getApiErrorMessage } from '../../../services/api-error';
import { Produto, ProdutoPayload, ProdutoService } from '../../../services/produto.service';

type ProdutoControlName =
  | 'nome'
  | 'preco_atual'
  | 'preco_promocao'
  | 'tipo'
  | 'descricao'
  | 'data_validade';

interface ProdutoField {
  name: ProdutoControlName;
  label: string;
  type: 'text' | 'number' | 'date';
  placeholder: string;
  autocomplete: string;
}

function promocaoMenorQuePreco(control: AbstractControl): ValidationErrors | null {
  const precoAtual = Number(control.get('preco_atual')?.value);
  const precoPromocaoRaw = control.get('preco_promocao')?.value;

  if (
    precoPromocaoRaw === null ||
    precoPromocaoRaw === undefined ||
    String(precoPromocaoRaw).trim() === ''
  ) {
    return null;
  }

  const precoPromocao = Number(precoPromocaoRaw);

  if (!Number.isFinite(precoAtual) || !Number.isFinite(precoPromocao)) {
    return null;
  }

  return precoPromocao < precoAtual ? null : { promocaoInvalida: true };
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly valoresPromocao = signal<Partial<Record<number, string>>>({});
  protected readonly produtoFormAberto = signal(false);
  protected readonly produtoEmEdicao = signal<Produto | null>(null);
  protected readonly produtoSubmitted = signal(false);
  protected readonly carregandoProdutos = signal(false);
  protected readonly erroProdutos = signal<string | null>(null);

  protected readonly produtoFields = signal<readonly ProdutoField[]>([
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Ex: Arroz Branco Tipo 1 5kg',
      autocomplete: 'off',
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'text',
      placeholder: 'Ex: Mercearia',
      autocomplete: 'off',
    },
    {
      name: 'preco_atual',
      label: 'Preco atual',
      type: 'number',
      placeholder: 'Ex: 24.90',
      autocomplete: 'off',
    },
    {
      name: 'preco_promocao',
      label: 'Preco promocional',
      type: 'number',
      placeholder: 'Opcional',
      autocomplete: 'off',
    },
    {
      name: 'data_validade',
      label: 'Data de validade',
      type: 'date',
      placeholder: '',
      autocomplete: 'off',
    },
    {
      name: 'descricao',
      label: 'Descricao',
      type: 'text',
      placeholder: 'Descreva o produto',
      autocomplete: 'off',
    },
  ]);

  protected readonly resumoProdutos = computed(() => [
    {
      label: 'Produtos',
      valor: this.produtos().length.toString(),
    },
    {
      label: 'Com promocao',
      valor: this.produtos().filter((produto) => produto.preco_promocao !== null).length.toString(),
    },
    {
      label: 'Tipos',
      valor: new Set(this.produtos().map((produto) => produto.tipo)).size.toString(),
    },
  ]);

  protected readonly produtoForm = new FormGroup(
    {
      nome: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      preco_atual: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(0.01)],
      }),
      preco_promocao: new FormControl<number | null>(null, {
        validators: [Validators.min(0.01)],
      }),
      tipo: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      descricao: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
      data_validade: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: promocaoMenorQuePreco },
  );

  ngOnInit(): void {
    this.carregarProdutos();
  }

  protected abrirCadastroProduto(): void {
    this.produtoEmEdicao.set(null);
    this.produtoFormAberto.set(true);
    this.produtoSubmitted.set(false);
    this.produtoForm.reset({
      nome: '',
      preco_atual: null,
      preco_promocao: null,
      tipo: '',
      descricao: '',
      data_validade: '',
    });
  }

  protected abrirEdicaoProduto(produto: Produto): void {
    this.produtoEmEdicao.set(produto);
    this.produtoFormAberto.set(true);
    this.produtoSubmitted.set(false);
    this.produtoForm.reset({
      nome: produto.nome,
      preco_atual: produto.preco_atual,
      preco_promocao: produto.preco_promocao,
      tipo: produto.tipo,
      descricao: produto.descricao,
      data_validade: produto.data_validade,
    });
  }

  protected fecharFormularioProduto(): void {
    this.produtoFormAberto.set(false);
    this.produtoEmEdicao.set(null);
    this.produtoSubmitted.set(false);
  }

  protected salvarProduto(): void {
    this.produtoSubmitted.set(true);

    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      alert('Preencha os dados do produto corretamente.');
      return;
    }

    const produtoAtual = this.produtoEmEdicao();
    const produtoPayload = this.criarProdutoPayload();

    if (produtoAtual) {
      this.produtoService.atualizar(produtoAtual.id, produtoPayload).subscribe({
        next: (produtoAtualizado) => {
          this.produtos.update((produtos) =>
            produtos.map((produto) =>
              produto.id === produtoAtual.id ? produtoAtualizado : produto,
            ),
          );
          this.fecharFormularioProduto();
          alert(`Produto ${produtoAtualizado.nome} atualizado.`);
        },
        error: (error: unknown) => {
          alert(getApiErrorMessage(error, 'Nao foi possivel atualizar o produto.'));
        },
      });
      return;
    }

    this.produtoService.criar(produtoPayload).subscribe({
      next: (novoProduto) => {
        this.produtos.update((produtos) => [novoProduto, ...produtos]);
        this.fecharFormularioProduto();
        alert(`Produto ${novoProduto.nome} adicionado.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel cadastrar o produto.'));
      },
    });
  }

  protected removerProduto(produto: Produto): void {
    const deveRemover = confirm(`Remover o produto ${produto.nome}?`);

    if (!deveRemover) {
      return;
    }

    this.produtoService.remover(produto.id).subscribe({
      next: () => {
        this.produtos.update((produtos) => produtos.filter((item) => item.id !== produto.id));

        this.valoresPromocao.update((valores) => {
          const novosValores = { ...valores };
          delete novosValores[produto.id];

          return novosValores;
        });

        if (this.produtoEmEdicao()?.id === produto.id) {
          this.fecharFormularioProduto();
        }

        alert(`Produto ${produto.nome} removido.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel remover o produto.'));
      },
    });
  }

  protected atualizarValorPromocao(produtoId: number, event: Event): void {
    const input = event.target as HTMLInputElement;

    this.valoresPromocao.update((valores) => ({
      ...valores,
      [produtoId]: input.value,
    }));
  }

  protected adicionarPromocao(produto: Produto): void {
    const valorDigitado = this.valoresPromocao()[produto.id]?.replace(',', '.');
    const precoPromocao = Number(valorDigitado);

    if (!precoPromocao || precoPromocao <= 0) {
      alert('Informe um valor de promocao valido.');
      return;
    }

    if (precoPromocao >= produto.preco_atual) {
      alert('O preco promocional precisa ser menor que o preco atual.');
      return;
    }

    this.produtoService.atualizar(produto.id, { preco_promocao: precoPromocao }).subscribe({
      next: (produtoAtualizado) => {
        this.produtos.update((produtos) =>
          produtos.map((item) => (item.id === produto.id ? produtoAtualizado : item)),
        );

        this.valoresPromocao.update((valores) => {
          const novosValores = { ...valores };
          delete novosValores[produto.id];

          return novosValores;
        });

        alert(`Promocao adicionada para ${produto.nome}.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel adicionar a promocao.'));
      },
    });
  }

  protected removerPromocao(produto: Produto): void {
    this.produtoService.atualizar(produto.id, { preco_promocao: null }).subscribe({
      next: (produtoAtualizado) => {
        this.produtos.update((produtos) =>
          produtos.map((item) => (item.id === produto.id ? produtoAtualizado : item)),
        );

        alert(`Promocao removida de ${produto.nome}.`);
      },
      error: (error: unknown) => {
        alert(getApiErrorMessage(error, 'Nao foi possivel remover a promocao.'));
      },
    });
  }

  protected formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  protected hasProdutoError(controlName: ProdutoControlName): boolean {
    const control = this.produtoForm.controls[controlName];
    const hasPromocaoInvalida =
      controlName === 'preco_promocao' && this.produtoForm.hasError('promocaoInvalida');

    return (control.invalid || hasPromocaoInvalida) && (control.touched || this.produtoSubmitted());
  }

  protected getProdutoErrorMessage(controlName: ProdutoControlName): string {
    const control = this.produtoForm.controls[controlName];

    if (control.hasError('required')) {
      return 'Campo obrigatorio.';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'descricao') {
        return 'Informe pelo menos 10 caracteres.';
      }

      if (controlName === 'tipo') {
        return 'Informe pelo menos 2 caracteres.';
      }

      return 'Informe pelo menos 3 caracteres.';
    }

    if (control.hasError('min')) {
      return 'Informe um valor maior que zero.';
    }

    if (controlName === 'preco_promocao' && this.produtoForm.hasError('promocaoInvalida')) {
      return 'O preco promocional precisa ser menor que o preco atual.';
    }

    return '';
  }

  private carregarProdutos(): void {
    this.carregandoProdutos.set(true);
    this.erroProdutos.set(null);

    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
      },
      error: (error: unknown) => {
        this.erroProdutos.set(getApiErrorMessage(error, 'Nao foi possivel carregar os produtos.'));
        this.carregandoProdutos.set(false);
      },
      complete: () => {
        this.carregandoProdutos.set(false);
      },
    });
  }

  private criarProdutoPayload(): ProdutoPayload {
    const { nome, preco_atual, preco_promocao, tipo, descricao, data_validade } =
      this.produtoForm.getRawValue();
    const precoPromocao =
      preco_promocao === null ||
      preco_promocao === undefined ||
      String(preco_promocao).trim() === ''
        ? null
        : Number(preco_promocao);

    return {
      nome: nome.trim(),
      preco_atual: Number(preco_atual),
      preco_promocao: precoPromocao,
      tipo: tipo.trim(),
      descricao: descricao.trim(),
      data_validade,
    };
  }
}
