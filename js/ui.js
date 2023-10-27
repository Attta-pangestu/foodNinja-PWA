const recipeField = document.querySelector('.recipes') ;

export const renderDataRecipe = (recipeArray) => {
    recipeField.innerHTML = `` ; 
    recipeArray.forEach(recipe => {
        recipeField.innerHTML += renderCardHTML(recipe) ; 
    });
};

const renderCardHTML = ({judul, bahan, id}) => {
    return `
    <div class="card-panel recipe white row" data-target="${id}">
        <img src="/img/dish.png" alt="recipe thumb">
        <div class="recipe-details">
            <div class="recipe-title">${judul}</div>
            <div class="recipe-ingredients">${bahan}</div>
        </div>
        <div class="recipe-delete">
            <i class="material-icons" data-id=${id}>delete_outline</i>
        </div>
    </div>
    ` ;
} ;



export const removeRecipeUI = (id) => {
    const recipeById = document.querySelector(`.recipe[data-target="${id}"]`);
    recipeById.remove() ; 
};