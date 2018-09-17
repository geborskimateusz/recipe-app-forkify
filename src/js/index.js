import Search from './models/Search';
import Recipe from './models/Recipe';
import Recipe from './models/List';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
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

        try {
            await state.search.getResults();

            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            alert("No results found!");
            clearLoader();
        }
    }
};

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

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {

        recipeView.clearRecipe();

        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();


            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


elements.recipe.addEventListener('click', e => {
    console.log('clicked'); 
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            console.log('in if');
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        console.log('in else');
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } 
});



