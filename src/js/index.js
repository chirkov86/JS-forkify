import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { STATUS_CODES } from 'http';

const state = {};

/**
 * Search controller
 */
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add it to state 
        state.search = new Search(query);

        // 3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            // 4. search for recipes
            await state.search.getResults();

            // 5. render results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (err) {
            console.log(err);
            alert(err);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    // closest() returns button instead of it's innner elements clicked, e.g. <svg> or <span>
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
});

/**
 * Recipe controller
 */
const controlRecipe = async () => {
    // location returns entire URL
    const id = `${window.location.hash}`.substring(1);
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if (state.search) searchView.highlightSelected(id);

        // Create Recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();

            // Render
            clearLoader();
            const isLiked = state.likes ? state.likes.isLiked(id) : false;
            recipeView.renderRecipe(state.recipe, isLiked);

        } catch (err) {
            console.log(err);
            alert(err);
        }
    }
};

// 'hashchange' is for click on a recipe and 'load' is for load URL with anchor without clicking (e.g. from a bookmark)
['hashchange', 'load'].forEach(it => window.addEventListener(it, controlRecipe));

// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
    // event may happen on '.btn-decrease' class and child elements of '.btn-decrease' class
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrease btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if there is none yet 
    if (!state.list) {
        state.list = new List();
    }

    listView.clearList();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handle delete and update events on the items list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle delete btn
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI 
        listView.deleteItem(id);
        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKES CONTROLLER
 */
const controlLike = () => {
    const id = state.recipe.id;

    // User has not liked current recipe yet
    if (!state.likes.isLiked(id)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toogle like btn
        likesView.toggleLikeBtn(true);
        // Add like to UI list
        likesView.renderLike(newLike);
        // User has liked it already    
    } else {
        // Remove like from the state
        state.likes.deleteLike(id);
        // Toogle like btn
        likesView.toggleLikeBtn(false);
        // Remove like from UI list
        likesView.deleteLike(id);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recepies on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(it => {
        likesView.renderLike(it);
    });
});