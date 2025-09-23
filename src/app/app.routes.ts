import { Routes } from '@angular/router';
import { MusicosGrupoComponent } from './musicos-grupo/musicos-grupo.component';
import { ProductosComponent } from './productos/productos.component';
import { DeudasComponent } from './deudas/deudas.component';

export const routes: Routes = [
  { path: 'musicos', component: MusicosGrupoComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'deudas', component: DeudasComponent },
  { path: '', redirectTo: '/musicos', pathMatch: 'full' },
  { path: '**', redirectTo: '/musicos' }
];
