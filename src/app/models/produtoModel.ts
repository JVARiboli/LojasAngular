import { LojaModel } from "./lojaModel";

export interface ProdutoModel {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  lojaId?: string;
  lojaModel?: LojaModel;
}