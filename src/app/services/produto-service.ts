
import { inject, Injectable } from '@angular/core';
import { ProdutoModel } from '../models/produtoModel';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/produtos';
  private produtos: ProdutoModel[] = [];


  listar(): Observable<ProdutoModel[]> {
    return this.http.get<ProdutoModel[]>(`${this.base}/listar`).
      pipe(catchError(this.handle));
  }

  adicionar(produto: Omit<ProdutoModel, 'id' | 'lojaModel'>): Observable<ProdutoModel>{
    return this.http
      .post<ProdutoModel>(`${this.base}/salvar`, produto)
      .pipe(catchError(this.handle));
  }

  remover(id : string): Observable<string>{
    return this.http.post(`${this.base}/apagar/${id}`, null,
      {responseType: 'text'}).pipe(catchError(this.handle));
  }

  editar(id: string, produto: ProdutoModel): Observable<ProdutoModel>{
    return this.http.post<ProdutoModel>(`${this.base}/editar/${id}`, produto)
    .pipe(catchError(this.handle));
  }

    private handle(err: HttpErrorResponse){
      const msg = err.error?.message || err.error?.erro || err.message || 'Erro inesperado';
      return throwError( () => new Error(msg) );
    }

}
