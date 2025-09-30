import { ProdutoModel } from "./produtoModel";

export interface LojaModel {
  id: string;
  nome: string;
  endereco: string;
  cnpj: string;
  produtos: ProdutoModel[]; 
}