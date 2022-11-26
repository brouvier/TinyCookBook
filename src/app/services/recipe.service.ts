import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";
import { SecurityService } from "./security.service";


export interface Recipe {
    id?: number,
    name: string, path: string, favorit: boolean | number,
    imgPath?: string, comment?: string, keywords?: string,

    error?: string,
    display?: boolean, filterKeyWorkds?: string
}

interface ApiResponse {
    success?: { code: number, status: string },
    error?: { code: number, status: string }
}

export const EMPTY_RECIPE: Recipe = { name: "", path: "", favorit: false }

@Injectable()
export class RecipeService {

    readonly apiRecipePath = environment.apiLocation + 'recipe/';

    private recipesSubject$ = new BehaviorSubject<Recipe[]>([]);

    constructor(private httpClient: HttpClient, private security: SecurityService, private messageServ: MessageService) {
        this.sendRecipe();
    }

    private sendRecipe() {
        this.select().subscribe({
            next: (next) => {
                next.forEach(r => {
                    r.favorit = r.favorit === 1 ? true : false;
                    r.display = false;
                    r.filterKeyWorkds = r.name + (r.keywords == undefined ? "" : " " + r.keywords);
                });
                next.sort((a, b) => {
                    if (a.favorit && !b.favorit)
                        return -1;
                    if (!a.favorit && b.favorit)
                        return 1;

                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    // a doit être égal à b
                    return 0;
                })
                this.recipesSubject$.next(next);
            },
            error: (error) => this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: error })
        })
    }

    public delRecipe(recipe: Recipe) {
        this.delete(recipe).subscribe({
            next: (next) => {
                console.log('delete recipe :', next);
                if (next.error) {
                    this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: next.error.code + " - " + next.error.status });
                    return;
                }
                this.messageServ.add({ severity: 'warn', summary: 'Suppression', detail: 'Recette supprimée' });
                this.sendRecipe();
            },
            error: (error) => this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: error })
        });
    }

    public insertRecipe(recipe: Recipe, callback: Function) {
        recipe.favorit = recipe.favorit === true ? 1 : 0;

        this.insert(recipe).subscribe({
            next: (next) => {
                console.log('insert recipe :', next);
                if (next.error) {
                    this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: next.error.code + " - " + next.error.status });
                    return;
                }
                this.messageServ.add({ severity: 'info', summary: 'Création de la recette', detail: recipe.name });
                callback();
                this.sendRecipe();
            },
            error: (error) => this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: error })
        });
    }

    public updateRecipe(recipe: Recipe, callback: Function) {
        // suppression des attributs liés à l'affichage
        delete recipe['display'];
        delete recipe['filterKeyWorkds'];
        recipe.favorit = recipe.favorit === true ? 1 : 0;

        this.update(recipe).subscribe({
            next: (next) => {
                console.log('update recipe :', next);
                if (next.error) {
                    this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: next.error.code + " - " + next.error.status });
                    return;
                }
                this.messageServ.add({ severity: 'info', summary: 'Mise à jour de la recette', detail: recipe.name });
                callback();
                this.sendRecipe();
            },
            error: (error) => this.messageServ.add({ severity: 'error', summary: 'Erreur de base de donnée', detail: error })
        });
    }

    private select() { return this.httpClient.get<Recipe[]>(this.apiRecipePath + '?by=name' + environment.apiLimit, { headers: this.security.getAppTocken() }) }
    private insert(recipe: Recipe) { return this.httpClient.post<ApiResponse>(this.apiRecipePath, recipe, { headers: this.security.getAppTocken() }) }
    private update(recipe: Recipe) { return this.httpClient.put<ApiResponse>(this.apiRecipePath + recipe.id, recipe, { headers: this.security.getAppTocken() }) }
    private delete(recipe: Recipe) { return this.httpClient.delete<ApiResponse>(this.apiRecipePath + recipe.id, { headers: this.security.getAppTocken() }) }

    public getRecipes(): Observable<Recipe[]> { return this.recipesSubject$.asObservable(); }
}