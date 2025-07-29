import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeList } from './recipe-list/recipe-list';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipeForm } from './recipe-form/recipe-form';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: RecipeList },
  { path: 'detail/:id', component: RecipeDetail },
  { path: 'create', component: RecipeForm, canActivate: [authGuard] },
  { path: 'edit/:id', component: RecipeForm, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
