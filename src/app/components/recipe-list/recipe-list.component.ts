import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Recipe, RecipeService } from 'src/app/services/recipe.service';
import { DialogService } from 'primeng/dynamicdialog';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';

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

  commentDisplay: boolean = false;

  constructor(private recipeSer: RecipeService, private confirmationServ: ConfirmationService, private dialogServ: DialogService, private messageServ: MessageService) {
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
      this.commentDisplay = true;
    }
  }

  update() {
    if (this.currentRecipe) {
      const ref = this.dialogServ.open(RecipeEditComponent, {
        header: 'Edition',
        width: '70%',
        data: this.currentRecipe
      });


      this.messageServ.add({ severity: 'info', summary: 'Mise à jour de la recette', detail: this.currentRecipe.name });
    }
  }

  delete() {
    if (this.currentRecipe) {
      this.confirmationServ.confirm({
        message: "Souhaitez vous supprimer la recette '" + this.currentRecipe.name + "' ?",
        header: 'Confirmation',
        acceptLabel: "Supprimer",
        acceptIcon: "pi pi-trash",
        acceptButtonStyleClass: "p-button-danger",
        rejectLabel: "Annuler",
        rejectButtonStyleClass: "p-button-secondary p-button-text",
        accept: () => {
          this.recipeSer.delRecipe(this.currentRecipe!);
        },
        reject: () => {
          this.messageServ.add({ severity: 'info', summary: 'Annulation', detail: 'Suppression de la recette annulée' });
        }
      });
    }
  }

}
