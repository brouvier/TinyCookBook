import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";


export interface Recipe {
    name: string; display: boolean, path: string, imgPath?: string, comment: string
}

@Injectable()
export class RecipeService {

    private recipes: Recipe[] = [];
    private recipesSubject$ = new BehaviorSubject<Recipe[]>([]);


    constructor(private httpClient: HttpClient) {
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
        this.recipesSubject$.next([...this.recipes]);
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
        this.sendRecipe();
    }

    public updateRecipe(recipe: Recipe) {
        this.recipes = this.recipes.filter(function (obj) {
            return obj.name !== recipe.name;
        });
        this.recipes.push(recipe);
        this.sendRecipe();
    }

}