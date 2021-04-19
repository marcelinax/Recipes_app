"use strict";

const getCategoryIcon = (category) => {
  let icon = "";
  switch (category) {
    case "Desserts":
      icon = "assets/svg/014-cupcake.svg";
      break;
    case "Breakfast":
      icon = "assets/svg/090-toaster.svg";
      break;
    case "Main dish":
      icon = "assets/svg/081-food.svg";
      break;
    case "Soups":
      icon = "assets/svg/206-bowl.svg";
      break;
    case "Salads":
      icon = "assets/svg/174-salad.svg";
      break;
    case "Starters":
      icon = "assets/svg/002-boiled.svg";
      break;
    case "Vege":
      icon = "assets/svg/vegan.svg";
      break;
  }
  return icon;
};
class Recipe {
  constructor(title, ingredients, description, category) {
    this.title = title;
    this.ingredients = ingredients;
    this.description = description;
    this.category = category;
    this.renderRecipe();
  }
  renderRecipe(recipeIndex) {
    const recipeItem = document.createElement("div");
    const recipesList = document.querySelector(".recipes-list");
    recipeItem.classList.add("recipe-item");
    let content = `
      <img src='/assets/trash-solid.svg' class='recipe-item-delete-btn'/>
      <h3 class='recipe-item-title'>${this.title}</h3>
      <p class='recipe-item-ingredients'>${this.ingredients}</p>
            <img src="${getCategoryIcon(
              this.category
            )}" class='recipe-item-category-icon'>

        `;
    recipeItem.addEventListener("click", () => {
      recipes.showRecipe(this);
    });
    recipeItem.innerHTML = content;
    recipesList.appendChild(recipeItem);
  }
}
class Recipes {
  recipes = [];
  category;
  searchingCategory = "";
  constructor() {
    this.readRecipeFromLocalStorage();
    this.initCreateNewRecipe();
    this.initCategoryBtns();
    this.initDeleteRecipe();
    this.initSerchRecipe();
  }
  saveRecipeInLocalStorage() {
    localStorage.setItem("recipes", JSON.stringify(this.recipes));
  }
  readRecipeFromLocalStorage() {
    this.recipes = [];
    const localStringRecipes = localStorage.getItem("recipes");
    if (localStringRecipes) {
      const recipesShapes = JSON.parse(localStorage.getItem("recipes"));
      recipesShapes.forEach((recipeShape) => {
        const recipe = new Recipe(
          recipeShape.title,
          recipeShape.ingredients,
          recipeShape.description,
          recipeShape.category
        );
        this.recipes.push(recipe);
      });
    }
  }
  createNewRecipe() {
    const title = document.getElementById("title").value;
    const ingredients = document.getElementById("ingredients").value;
    const description = document.getElementById("description").value;

    if (!title) {
      alert("Enter a title!");
      return;
    }
    if (!ingredients) {
      alert("Enter ingredients!");
      return;
    }
    if (!description) {
      alert("Enter a description!");
      return;
    }
    if (!this.category) {
      alert("Choose category!");
      return;
    }

    const recipe = new Recipe(title, ingredients, description, this.category);
    this.recipes.push(recipe);
    this.saveRecipeInLocalStorage();

    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    document.getElementById("description").value = "";
  }
  initCategoryBtns() {
    const categories = document.querySelectorAll(".category-btn");
    categories.forEach((c) => {
      c.addEventListener("click", (btn) => {
        this.category = btn.currentTarget.textContent.trim();
      });
    });
  }
  initCreateNewRecipe() {
    const addBtn = document.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
      this.createNewRecipe();
    });
  }
  showRecipe(recipe) {
    if (
      document
        .querySelector(".recipe-details")
        .classList.contains("recipe-details--active")
    ) {
      document
        .querySelector(".recipe-details")
        .classList.remove("recipe-details--active");
      setTimeout(() => {
        document
          .querySelector(".recipe-details")
          .classList.add("recipe-details--active");
      }, 600);
    } else {
      document
        .querySelector(".recipe-details")
        .classList.add("recipe-details--active");
    }

    const recipeDetails = document.querySelector(".recipe-details");

    let content = `
      <img class="close-btn" src='assets/close.svg'>
      <div class="recipe-box">
        <img class='recipe-box-category-icon' src="${getCategoryIcon(
          recipe.category
        )}">
        <h2 class="recipe-box-title">${recipe.title}</h2>
        <p class="recipe-box-ingredients"><strong>Ingredients:</strong> ${
          recipe.ingredients
        }</p>
        <p class="recipe-box-description"><strong>Preparation:</strong> ${
          recipe.description
        }</p>
      </div>
      `;
    recipeDetails.innerHTML = content;
    recipeDetails.querySelector(".close-btn").addEventListener("click", () => {
      recipeDetails.classList.remove("recipe-details--active");
    });
  }

  deleteRecipe(index) {
    document
      .querySelector(".recipe-details")
      .classList.remove("recipe-details--active");
    this.recipes = [...this.recipes.filter((_, i) => i != index)];
    this.saveRecipeInLocalStorage();
    location.reload();
  }
  initDeleteRecipe() {
    const deleteBtns = document.querySelectorAll(".recipe-item-delete-btn");
    deleteBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        this.deleteRecipe(index);
      });
    });
  }

  searchRecipe() {
    document.querySelector(".recipes-list").innerHTML = "";
    const inputValue = document.getElementById("search-input").value;

    this.recipes
      .filter(
        (r) =>
          r.title.includes(inputValue) ||
          r.ingredients.includes(inputValue) ||
          r.description.includes(inputValue)
      )
      .filter(
        (r) =>
          r.category.toString().toLowerCase() === this.searchingCategory ||
          this.searchingCategory === ""
      )
      .forEach((recipe, index) => {
        recipe.renderRecipe(index);
      });
  }
  searchRecipeByCategory(categoryName) {
    this.searchingCategory = categoryName.toLowerCase();
    this.searchRecipe();
  }
  initSerchRecipe() {
    document
      .getElementById("search-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.searchRecipe();
          document
            .querySelector(".search-recipe")
            .classList.remove("search-recipe--active");
        }
      });
    const categoryBtns = document.querySelectorAll(".category");
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.searchRecipeByCategory(e.target.innerHTML);
      });
    });
    const allCategoriesBtn = document.querySelector(".category-all");
    allCategoriesBtn.addEventListener("click", () => {
      document.querySelector(".recipes-list").innerHTML = "";
      this.recipes.forEach((recipe, index) => {
        recipe.renderRecipe();
      });
    });
  }
}

class UI {
  constructor() {
    this.initShowRecipeForm();
    this.initCloseRecipeForm();
    this.initOpenSearch();
    this.initCloseSearch();
  }
  initShowRecipeForm() {
    const createBtn = document.getElementById("create-recipe");
    createBtn.addEventListener("click", () => {
      document
        .querySelector(".form-recipe")
        .classList.toggle("form-recipe--active");
    });
  }
  initCloseRecipeForm() {
    const cancelBtn = document.querySelector(".cancel-btn");
    cancelBtn.addEventListener("click", () => {
      document
        .querySelector(".form-recipe")
        .classList.toggle("form-recipe--active");
      location.reload();
    });
  }
  initOpenSearch() {
    const searchBtn = document.getElementById("search-recipe");
    searchBtn.addEventListener("click", () => {
      document
        .querySelector(".search-recipe")
        .classList.toggle("search-recipe--active");
    });
  }
  initCloseSearch() {
    const closeSearchBtn = document.querySelector(".close-search-btn");
    closeSearchBtn.addEventListener("click", () => {
      document
        .querySelector(".search-recipe")
        .classList.toggle("search-recipe--active");
    });
  }
}

const recipes = new Recipes();
const ui = new UI();
