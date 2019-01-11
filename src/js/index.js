import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
var json = require('./sampleResult.json');

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
            //await state.search.getResults();
            state.search.result = json;

            // 5. render results on UI
            clearLoader();
            console.log(state.search.result);
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
        console.log(goToPage);
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
    console.log(id);

    if (id) {
        // Prepare UI for changes

        // Create Recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            // await state.recipe.getRecipe();
            state.recipe = require('./sampleRecipe.json');

            // Calculate servings and time
            //  state.recipe.calcTime();
            //  state.recipe.calcServings();

            // Render
            console.log(state.recipe);
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }
};

// 'hashchange' is for click on a recipe and 'load' is for load URL with anchor without clicking (e.g. from a bookmark)
['hashchange', 'load'].forEach(it => window.addEventListener(it, controlRecipe));
