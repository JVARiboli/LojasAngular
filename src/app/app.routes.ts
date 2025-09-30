import { Routes } from '@angular/router';
import { ProdutoComponent } from './component/produto-component/produto-component';
import { HomeComponent } from './component/home-component/home-component';
import { LojaComponent } from './component/loja-component/loja-component';

export const routes: Routes = [
{path: 'produtos', component: ProdutoComponent},
{path: 'lojas', component: LojaComponent},
{path: '', component: HomeComponent}
];
