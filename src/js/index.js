import Search from './models/Search';
import { elements } from './views/base';
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

        // 4. search for recipes
        //await state.search.getResults();
        state.search.result = json;

        // 5. render results on UI
        //console.log(state.search.result);
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});