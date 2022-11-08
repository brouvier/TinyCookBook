import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Recipe, RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: 'recipe-list.component.html'
})
export class RecipeListComponent implements OnInit, OnDestroy {

  @ViewChild('dataView') dataView: DataView | undefined;

  textFilter = '';

  recipeList: Recipe[] = []
  currentRecipe: Recipe | undefined;
  recipeListSub: Subscription = new Subscription();

  menuItems: MenuItem[];

  constructor(private recipeSer: RecipeService, private messageServ: MessageService) {
    this.menuItems = [
      { label: 'Voir le commentaire', icon: 'pi pi-eye', command: () => this.show() },
      { label: 'Editer la recette', icon: 'pi pi-fw pi-pencil', command: () => this.update() },
      { label: 'Supprimer la recette', icon: 'pi pi-fw pi-trash', command: () => this.delete() },
    ];
  }

  ngOnInit(): void {
    this.recipeListSub = this.recipeSer.getRecipes().subscribe(next => { this.recipeList = next });
  }

  ngOnDestroy(): void {
    this.recipeListSub.unsubscribe();
  }

  applyGlobalFilter() {
    this.dataView!.filter(this.textFilter, "contains");
  }

  openRecipe(recipe: Recipe) {
    window.open(recipe.path, '_blank');
  }

  show() {
    if (this.currentRecipe) {
      this.messageServ.add({ severity: 'success', summary: 'Affichage du commentaire', detail: this.currentRecipe.name });
    }
  }

  update() {
    if (this.currentRecipe) {
      this.messageServ.add({ severity: 'info', summary: 'Mise à jour de la recette', detail: this.currentRecipe.name });
    }
  }

  delete() {
    if (this.currentRecipe) {
      this.messageServ.add({ severity: 'warn', summary: 'Suppression de la recette', detail: this.currentRecipe.name });
    }
  }

}
