import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Recipe, RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: 'recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit {

  recipe: Recipe;

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private recipeSer: RecipeService) {
    this.recipe = { ...this.config.data };
  }

  ngOnInit(): void {
  }

  save() {
    this.recipeSer.updateRecipe(this.recipe, () => { this.cancel() });
  }

  cancel() {
    this.ref.close();
  }

}
