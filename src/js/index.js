import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
var json = require('./sampleResult.json');

const state = {};

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

        // 4. search for recipes
        //await state.search.getResults();
        state.search.result = json;

        // 5. render results on UI
        clearLoader();
        console.log(state.search.result);
        searchView.renderResult(state.search.result);
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
})