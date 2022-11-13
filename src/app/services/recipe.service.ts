import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { MessageService } from "primeng/api";


export interface Recipe {
    id?: number,
    name: string, path: string,
    imgPath?: string, comment?: string, keywords?: string,

    display?: boolean, filterKeyWorkds?: string
}

export const EMPTY_RECIPE: Recipe = {
    name: "",
    path: ""
}

@Injectable()
export class RecipeService {

    private recipes: Recipe[] = [];
    private recipesSubject$ = new BehaviorSubject<Recipe[]>([]);


    constructor(private httpClient: HttpClient, private messageServ: MessageService) {
        this.httpClient.get<Recipe[]>(
            "assets/recipe.json"
        ).subscribe({
            next: (response) => {
                this.recipes = response;
                this.sendRecipe();
            },
            error: (e) => console.log('Erreur : ', e)
        });
    }

    /** 
     * Expose une copie de la liste des recettes
     */
    private sendRecipe() {
        this.recipes.sort((a: Recipe, b: Recipe) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        const recipes = [...this.recipes];
        recipes.forEach(r => {
            r.display = false;
            r.filterKeyWorkds = r.name + " " + r.keywords;
        });
        this.recipesSubject$.next(recipes);
    }

    public getRecipes(): Observable<Recipe[]> {
        return this.recipesSubject$.asObservable();
    }

    public addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.sendRecipe();
    }

    public delRecipe(recipe: Recipe) {
        this.recipes = this.recipes.filter(function (obj) {
            return obj.name !== recipe.name;
        });
        this.messageServ.add({ severity: 'warn', summary: 'Suppression', detail: 'Recette supprimée' });
        this.sendRecipe();
    }

    public insertRecipe(recipe: Recipe, callback: Function) {
        recipe.id = 1;
        this.recipes.push(recipe);
        this.messageServ.add({ severity: 'info', summary: 'Création de la recette', detail: recipe.name });
        callback();
        this.sendRecipe();
    }

    public updateRecipe(recipe: Recipe, callback: Function) {
        this.recipes = this.recipes.filter(function (obj) {
            return obj.name !== recipe.name;
        });
        this.recipes.push(recipe);
        this.messageServ.add({ severity: 'info', summary: 'Mise à jour de la recette', detail: recipe.name });
        callback();
        this.sendRecipe();
    }

}