import axios from 'axios';
import { proxy, key } from '../config'


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (e) {
            console.log(e);
            alert('something went wrong :(')
        }
    };

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients(){
        const unitLong = [
            'tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = [
            ' tbsp ',' tbsp ',' oz ',' oz ',' tsp ',' tsp' ,' cup ',' pound '];

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit,unitShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            return ingredient;

        });

        this.ingredients =  newIngredients;

    };
}