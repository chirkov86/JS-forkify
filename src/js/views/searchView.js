import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const renderResult = (recipes, page = 1, resPerPage = 5) => {
    const start = (page - 1) * resPerPage;
    const end = start + resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resPerPage);
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

const renderRecipe = recipe => {
    const markup = `                
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let btn;

    if (page === 1 && pages > 1) {
        // next
        btn = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // prev
        btn = createButton(page, 'prev');
    } else if (pages === 1) {
        // none
    } else {
        // both
        btn = `
            ${createButton(page, 'next')} 
            ${createButton(page, 'prev')}
        `;
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', btn);
};

// type: 'prev', 'next'
const createButton = (page, type) =>
    `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>`;