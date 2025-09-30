import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LojaModel } from '../models/lojaModel';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/loja';

  // Busca todas as lojas no backend.
  listar(): Observable<LojaModel[]> {
    return this.http.get<LojaModel[]>(`${this.base}/listar`)
      .pipe(catchError(this.handle));
  }

  adicionar(loja: Omit<LojaModel, 'id' | 'produtos'>): Observable<LojaModel> {
    return this.http.post<LojaModel>(`${this.base}/salvar`, loja)
      .pipe(catchError(this.handle));
  }
  
  editar(id: string, loja: Omit<LojaModel, 'id' | 'produtos'>): Observable<LojaModel> {
    return this.http.post<LojaModel>(`${this.base}/editar/${id}`, loja)
      .pipe(catchError(this.handle));
  }

  remover(id: string): Observable<string> {
    return this.http.post(`${this.base}/apagar/${id}`, null, { responseType: 'text' })
      .pipe(catchError(this.handle));
  }

  private handle(err: HttpErrorResponse) {
    const msg = err.error?.message || err.error?.erro || err.message || 'Erro inesperado';
    return throwError(() => new Error(msg));
  }
}