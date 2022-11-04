import { Component, OnInit, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';

export interface Recipe {
  name: string; display: boolean, path: string, comment: string
}

@Component({
  selector: 'app-recipe-list',
  templateUrl: 'recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

  @ViewChild('dataView') dataView: DataView | undefined;

  textFilter = '';

  recipeList: Recipe[] = [
    { name: "Recette 1", display: false, path: "", comment: "" },
    { name: "Recette 2", display: false, path: "", comment: "" },
    { name: "Recette 3", display: false, path: "", comment: "" },
    { name: "Recette 4", display: false, path: "", comment: "" },
    { name: "Recette 5", display: false, path: "", comment: "" },
    { name: "Recette 6", display: false, path: "", comment: "" },
    { name: "Recette 7", display: false, path: "", comment: "" },
    { name: "Recette 8", display: false, path: "", comment: "" },
    { name: "Recette 9", display: false, path: "", comment: "" },
    { name: "Recette 10", display: false, path: "", comment: "" },
    { name: "Recette 11", display: false, path: "", comment: "" },
    { name: "Recette 12", display: false, path: "", comment: "" },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  applyGlobalFilter() {
    this.dataView!.filter(this.textFilter, "contains");
  }

}
