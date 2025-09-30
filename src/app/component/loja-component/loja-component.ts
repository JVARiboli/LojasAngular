// src/app/components/loja-component/loja-component.ts

import { Component, OnInit, inject } from '@angular/core';
import { LojaModel } from '../../models/lojaModel';
import { LojaService } from '../../services/loja-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loja-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './loja-component.html',
  styleUrls: ['./loja-component.css']
})
export class LojaComponent implements OnInit {
  private service = inject(LojaService);

  lojas: LojaModel[] = [];
  lojaEmEdicao: LojaModel | null = null;
  novaLoja = { nome: '', cnpj: '', endereco: '' };

  loading = false;
  erro = '';
  sucesso = '';

  ngOnInit() {
    this.carregarLojas();
  }

  carregarLojas() {
    this.loading = true;
    this.service.listar().subscribe({
      next: (data) => {
        this.lojas = data;
        this.loading = false;
      },
      error: (e) => this.handleError(e.message)
    });
  }

  adicionarLoja() {
    if (!this.novaLoja.nome.trim() || !this.novaLoja.cnpj.trim() || !this.novaLoja.endereco.trim()) {
      this.erro = 'Todos os campos são obrigatórios.';
      return;
    }
    this.loading = true;
    this.service.adicionar(this.novaLoja).subscribe({
      next: (lojaSalva) => {
        this.handleSuccess(`Loja "${lojaSalva.nome}" salva com sucesso!`);
        this.novaLoja = { nome: '', cnpj: '', endereco: '' };
        this.carregarLojas();
      },
      error: (e) => this.handleError(e.message)
    });
  }

  removerLoja(id: string) {
    if (!confirm('Tem certeza que deseja remover esta loja?')) return;
    
    this.loading = true;
    this.service.remover(id).subscribe({
      next: (msg) => {
        this.handleSuccess(msg);
        this.carregarLojas();
      },
      error: (e) => this.handleError(e.message)
    });
  }
  
  iniciarEdicao(loja: LojaModel) {
    this.lojaEmEdicao = { ...loja };
  }

  salvarEdicao() {
    if (!this.lojaEmEdicao) return;

    this.loading = true;
    const { id, nome, cnpj, endereco } = this.lojaEmEdicao;
    this.service.editar(id, { nome, cnpj, endereco }).subscribe({
      next: (lojaEditada) => {
        this.handleSuccess(`Loja "${lojaEditada.nome}" atualizada com sucesso!`);
        this.lojaEmEdicao = null;
        this.carregarLojas();
      },
      error: (e) => this.handleError(e.message)
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
}