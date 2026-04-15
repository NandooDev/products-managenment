import { Component, computed, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

type ProdutoControlName =
  | 'nome'
  | 'preco_atual'
  | 'preco_promocao'
  | 'tipo'
  | 'descricao'
  | 'data_validade';

interface Produto {
  id: number;
  nome: string;
  preco_atual: number;
  preco_promocao: number | null;
  tipo: string;
  descricao: string;
  data_validade: string;
}

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
export class Home {
  protected readonly produtos = signal<Produto[]>([
    {
      id: 1,
      nome: 'Arroz Branco Tipo 1 5kg',
      preco_atual: 24.9,
      preco_promocao: null,
      tipo: 'Mercearia',
      descricao: 'Pacote de arroz branco tipo 1 para o preparo das refeicoes do dia a dia.',
      data_validade: '2026-09-30',
    },
    {
      id: 2,
      nome: 'Feijao Carioca 1kg',
      preco_atual: 8.99,
      preco_promocao: null,
      tipo: 'Mercearia',
      descricao: 'Feijao carioca selecionado, indicado para consumo domestico e reposicao de estoque.',
      data_validade: '2026-08-15',
    },
    {
      id: 3,
      nome: 'Acucar Refinado 1kg',
      preco_atual: 4.79,
      preco_promocao: null,
      tipo: 'Mercearia',
      descricao: 'Acucar refinado para uso em bebidas, receitas e confeitaria simples.',
      data_validade: '2026-10-10',
    },
    {
      id: 4,
      nome: 'Leite Integral 1L',
      preco_atual: 5.49,
      preco_promocao: null,
      tipo: 'Laticinios',
      descricao: 'Leite integral UHT em embalagem longa vida para consumo diario.',
      data_validade: '2026-05-20',
    },
    {
      id: 5,
      nome: 'Cafe Torrado e Moido 500g',
      preco_atual: 18.9,
      preco_promocao: null,
      tipo: 'Bebidas',
      descricao: 'Cafe torrado e moido tradicional para preparo coado ou em cafeteira.',
      data_validade: '2026-07-01',
    },
    {
      id: 6,
      nome: 'Oleo de Soja 900ml',
      preco_atual: 7.59,
      preco_promocao: null,
      tipo: 'Mercearia',
      descricao: 'Oleo de soja para preparo de alimentos, refogados e frituras.',
      data_validade: '2026-11-30',
    },
    {
      id: 7,
      nome: 'Macarrao Espaguete 500g',
      preco_atual: 5.29,
      preco_promocao: null,
      tipo: 'Massas',
      descricao: 'Macarrao espaguete de semola para refeicoes rapidas e acompanhamentos.',
      data_validade: '2026-09-12',
    },
    {
      id: 8,
      nome: 'Sabao em Po 1,6kg',
      preco_atual: 21.9,
      preco_promocao: null,
      tipo: 'Limpeza',
      descricao: 'Sabao em po para lavagem de roupas brancas e coloridas.',
      data_validade: '2027-01-28',
    },
    {
      id: 9,
      nome: 'Papel Higienico Folha Dupla 12 Rolos',
      preco_atual: 19.99,
      preco_promocao: null,
      tipo: 'Higiene',
      descricao: 'Pacote com 12 rolos de papel higienico folha dupla para uso familiar.',
      data_validade: '2027-03-25',
    },
    {
      id: 10,
      nome: 'Peito de Frango Resfriado 1kg',
      preco_atual: 17.99,
      preco_promocao: null,
      tipo: 'Acougue',
      descricao: 'Peito de frango resfriado, embalado e pronto para preparo.',
      data_validade: '2026-04-22',
    },
    {
      id: 11,
      nome: 'Banana Prata 1kg',
      preco_atual: 6.99,
      preco_promocao: null,
      tipo: 'Hortifruti',
      descricao: 'Banana prata fresca para consumo direto, vitaminas e sobremesas.',
      data_validade: '2026-04-20',
    },
    {
      id: 12,
      nome: 'Tomate Italiano 1kg',
      preco_atual: 9.49,
      preco_promocao: null,
      tipo: 'Hortifruti',
      descricao: 'Tomate italiano selecionado para saladas, molhos e preparos caseiros.',
      data_validade: '2026-04-19',
    },
  ]);

  protected readonly valoresPromocao = signal<Partial<Record<number, string>>>({});
  protected readonly produtoFormAberto = signal(false);
  protected readonly produtoEmEdicao = signal<Produto | null>(null);
  protected readonly produtoSubmitted = signal(false);

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

    if (produtoAtual) {
      const produtoAtualizado = this.criarProdutoDoFormulario(produtoAtual.id);

      this.produtos.update((produtos) =>
        produtos.map((produto) => (produto.id === produtoAtual.id ? produtoAtualizado : produto)),
      );
      this.fecharFormularioProduto();
      alert(`Produto ${produtoAtualizado.nome} atualizado.`);
      return;
    }

    const novoProduto = this.criarProdutoDoFormulario(this.getProximoProdutoId());

    this.produtos.update((produtos) => [novoProduto, ...produtos]);
    this.fecharFormularioProduto();
    alert(`Produto ${novoProduto.nome} adicionado.`);
  }

  protected removerProduto(produto: Produto): void {
    const deveRemover = confirm(`Remover o produto ${produto.nome}?`);

    if (!deveRemover) {
      return;
    }

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

    this.produtos.update((produtos) =>
      produtos.map((item) =>
        item.id === produto.id ? { ...item, preco_promocao: precoPromocao } : item,
      ),
    );

    this.valoresPromocao.update((valores) => {
      const novosValores = { ...valores };
      delete novosValores[produto.id];

      return novosValores;
    });

    alert(`Promocao adicionada para ${produto.nome}.`);
  }

  protected removerPromocao(produto: Produto): void {
    this.produtos.update((produtos) =>
      produtos.map((item) => (item.id === produto.id ? { ...item, preco_promocao: null } : item)),
    );

    alert(`Promocao removida de ${produto.nome}.`);
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

  private criarProdutoDoFormulario(id: number): Produto {
    const { nome, preco_atual, preco_promocao, tipo, descricao, data_validade } =
      this.produtoForm.getRawValue();
    const precoPromocao =
      preco_promocao === null ||
      preco_promocao === undefined ||
      String(preco_promocao).trim() === ''
        ? null
        : Number(preco_promocao);

    return {
      id,
      nome: nome.trim(),
      preco_atual: Number(preco_atual),
      preco_promocao: precoPromocao,
      tipo: tipo.trim(),
      descricao: descricao.trim(),
      data_validade,
    };
  }

  private getProximoProdutoId(): number {
    return this.produtos().reduce((maiorId, produto) => Math.max(maiorId, produto.id), 0) + 1;
  }
}
