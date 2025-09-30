// src/app/components/produto-component/produto-component.ts

import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';
import { LojaService } from '../../services/loja-service';
import { LojaModel } from '../../models/lojaModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-component.html',
  styleUrl: './produto-component.css'
})
export class ProdutoComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private lojaService = inject(LojaService); 

  produtos: ProdutoModel[] = [];
  lojas: LojaModel[] = []; 

  editarItem: ProdutoModel | null = null;
  novoProduto: Omit<ProdutoModel, 'id' | 'lojaModel'> = this.criarProdutoVazio();

  erro = '';
  sucesso = '';
  loading = false;

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.produtoService.listar().subscribe({
      next: d => {
        this.produtos = d;
        this.loading = false;
      },
      error: e => this.handleError(e.message)
    });

    this.lojaService.listar().subscribe({
      next: data => this.lojas = data,
      error: e => this.handleError('Falha ao carregar lojas: ' + e.message)
    });
  }

  iniciarEdicao(produto: ProdutoModel) {
    this.editarItem = { 
        ...produto, 
        lojaId: produto.lojaModel?.id 
    };
  }

  adicionar() {
    this.erro = '';
    const precoNum = Number(this.novoProduto.preco);

    if (!this.novoProduto.nome.trim()) {
      this.erro = 'Informe o nome do produto.';
      return;
    }
    if (isNaN(precoNum) || precoNum <= 0) {
      this.erro = 'Preço inválido.';
      return;
    }
    if (!this.novoProduto.lojaId) {
      this.erro = 'Selecione uma loja para o produto.';
      return;
    }
    
    this.loading = true;
    this.produtoService.adicionar(this.novoProduto).subscribe({
      next: (p) => {
        this.handleSuccess(`Produto "${p.nome}" salvo com sucesso!`);
        this.novoProduto = this.criarProdutoVazio();
        this.carregarDados();
      },
      error: (e) => this.handleError(e.message)
    });
  }

  remover(id: string) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    
    this.produtoService.remover(id).subscribe({
      next: (msg) => {
        this.handleSuccess(msg || 'Produto apagado.');
        this.carregarDados();
      },
      error: e => this.handleError(e.message)
    });
  }

  salvarEdicao() {
    if (!this.editarItem?.id || !this.editarItem?.lojaId) {
        this.erro = "Loja é obrigatória para salvar a edição.";
        return;
    }

    this.loading = true;
    this.produtoService.editar(this.editarItem.id, this.editarItem).subscribe({
      next: result => {
        this.handleSuccess(`Produto "${result.nome}" atualizado com sucesso.`);
        this.editarItem = null;
        this.carregarDados();
      },
      error: e => this.handleError(e.message)
    });
  }

  private handleError(msg: string) {
    this.erro = msg;
    this.loading = false;
    setTimeout(() => this.erro = '', 5000);
  }

  private handleSuccess(msg: string) {
    this.sucesso = msg;
    this.loading = false;
    setTimeout(() => this.sucesso = '', 3000);
  }

  private criarProdutoVazio(): Omit<ProdutoModel, 'id' | 'lojaModel'> {
    return { nome: '', descricao: '', preco: 0, lojaId: undefined };
  }
}