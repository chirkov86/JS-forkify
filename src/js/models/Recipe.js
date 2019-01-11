import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            if (res.data.error) {
                // Happens when API limit is over
                alert(res.data.error);
            }
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    calcTime() {
        // Assuming that we need 15 min foe each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.calcServings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(it => {
            // Uniform units
            let ingredient = it.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            // Parse ingredients into count, unit and ingredient

            return ingredient;
        });
        this.ingredients = newIngredients;
    }
}