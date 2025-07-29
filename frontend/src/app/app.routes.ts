import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing-module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes-routing-module').then(m => m.RecipesRoutingModule)
  },
  { path: '**', redirectTo: '/recipes' }
];
