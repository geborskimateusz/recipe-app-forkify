import Search from './models/Search'
import * as searchView from './view/searchView';
import  { elements } from './view/base.js';

const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    console.log('typed = ' + query  );

    if (query) {
        state.search = new Search(query);

        console.log('Fetching result:');
        await state.search.getResults();
        console.log(state.search.result);

        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    console.log('Submit!');
    e.preventDefault();
    controlSearch();
})




