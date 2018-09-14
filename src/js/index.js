import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';

const state = {};

// Search Controller
const controlSearch = async () => {
    const query = searchView.getInput();
    console.log('typed = ' + query);

    if (query) {
        state.search = new Search(query);

        searchView.clearInput();

        searchView.clearResult();

        renderLoader(elements.searchRes);

        await state.search.getResults();

        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    console.log('Submit!');
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');

    if (button) {
        console.log('rendering');
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});


// Recipe Controller

// const controlRecipe = async () => {
//     const id = window.location.hash.replace('#','');
//     console.log(id);

//     if(id){

//         state.recipe = new Recipe(id);

//         await state.recipe.getRecipe();

//         state.recipe.calcTime();
//         state.recipe.calcServings();

//         console.log(state.recipe);
    
//     }
// };
 
// ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

