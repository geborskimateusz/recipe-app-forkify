import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import { elements, renderLoader, clearLoader } from './view/base.js';

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
        );
        } catch (e) {
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);

        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }

});

// LIKE CONTROLLER
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    }  else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add ingredients to shopping list
        controlLike();
    }
});



