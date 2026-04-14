import { Component, computed, signal } from '@angular/core';

interface Produto {
  id: number;
  nome: string;
  preco_atual: number;
  preco_promocao: number | null;
  tipo: string;
  descricao: string;
  data_validade: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly produtos = signal<Produto[]>([
    {
      id: 1,
      nome: 'Notebook Lenovo IdeaPad 15',
      preco_atual: 3899.9,
      preco_promocao: null,
      tipo: 'Notebook',
      descricao: 'Notebook com processador Intel Core i5, 16 GB de RAM e SSD de 512 GB.',
      data_validade: '2026-05-30',
    },
    {
      id: 2,
      nome: 'Smartphone Samsung Galaxy A56',
      preco_atual: 2499.9,
      preco_promocao: null,
      tipo: 'Smartphone',
      descricao: 'Smartphone com tela AMOLED de 6.7 polegadas, 256 GB e camera tripla.',
      data_validade: '2026-06-15',
    },
    {
      id: 3,
      nome: 'Smart TV LG 55 4K',
      preco_atual: 3199.9,
      preco_promocao: null,
      tipo: 'Televisao',
      descricao: 'TV 4K com HDR, webOS, controle smart e suporte aos principais streamings.',
      data_validade: '2026-07-10',
    },
    {
      id: 4,
      nome: 'Headset Gamer HyperX Cloud',
      preco_atual: 449.9,
      preco_promocao: null,
      tipo: 'Audio',
      descricao: 'Headset com microfone removivel, som surround e almofadas de espuma macia.',
      data_validade: '2026-05-20',
    },
    {
      id: 5,
      nome: 'Monitor Dell 27 Full HD',
      preco_atual: 1299.9,
      preco_promocao: null,
      tipo: 'Monitor',
      descricao: 'Monitor de 27 polegadas com painel IPS, bordas finas e ajuste de inclinacao.',
      data_validade: '2026-08-01',
    },
    {
      id: 6,
      nome: 'Console PlayStation 5 Slim',
      preco_atual: 4299.9,
      preco_promocao: null,
      tipo: 'Console',
      descricao: 'Console com SSD ultrarrapido, controle DualSense e leitor de disco.',
      data_validade: '2026-06-30',
    },
    {
      id: 7,
      nome: 'Tablet Apple iPad 10',
      preco_atual: 3499.9,
      preco_promocao: null,
      tipo: 'Tablet',
      descricao: 'Tablet com tela Liquid Retina de 10.9 polegadas, Wi-Fi e 64 GB.',
      data_validade: '2026-09-12',
    },
    {
      id: 8,
      nome: 'Caixa de Som JBL Charge',
      preco_atual: 899.9,
      preco_promocao: null,
      tipo: 'Audio',
      descricao: 'Caixa bluetooth resistente a agua, bateria de longa duracao e graves potentes.',
      data_validade: '2026-05-28',
    },
    {
      id: 9,
      nome: 'Mouse Logitech MX Master',
      preco_atual: 599.9,
      preco_promocao: null,
      tipo: 'Periferico',
      descricao: 'Mouse sem fio ergonomico com rolagem magnetica e botoes configuraveis.',
      data_validade: '2026-07-25',
    },
    {
      id: 10,
      nome: 'Roteador TP-Link Archer AX55',
      preco_atual: 699.9,
      preco_promocao: null,
      tipo: 'Rede',
      descricao: 'Roteador Wi-Fi 6 dual band com maior velocidade e cobertura para a casa.',
      data_validade: '2026-08-18',
    },
  ]);

  protected readonly valoresPromocao = signal<Partial<Record<number, string>>>({});

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

}
