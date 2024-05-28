"use strict";

// ***** CONSTANTS ***** //
const URL = "http://localhost:5678/api/";


// ***** VARIABLES ***** //
let categories = [];

// ***** FUNCTIONS ***** //

// FETCH // 

/**
 * Fetches the works data from the server and returns it as a promise.
 *
 * @return {Promise<Array>} A promise that resolves to an array of works data.
 */
async function fetchWorks() {
  const response = await fetch(URL + "works");
  const works = await response.json();

  return works;
}

/**
 * Fetches the categories data from the server and returns it as a promise.
 */
async function fetchCategories() {
  const response = await fetch(URL + "categories");
  categories = await response.json();
}

// DISPLAY WORKS //

/**
 * Adds works to the HTML gallery.
 *
 * @param {Array} works - An array of work objects containing properties like categoryId, imageUrl, and title.
 */
function addWorksToHTML(works) {
  console.log("Ajout des projets à la galerie...");

  for (const work of works) {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    figureElement.id = work.categoryId;
    figureElement.classList.add("works");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.innerText = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    document.querySelector(".gallery").appendChild(figureElement);

  };
}

// FILTERS //

/**
 * Adds filters to the DOM based on the given categories.
 *
 * @param {Array} categories - An array of category objects containing properties like id and name.
 */
function addFilters(categories) {
  const categoriesContainer = document.querySelector(".filters");

  const allButton = document.createElement("button");
  allButton.id = "all";
  allButton.innerText = "Tous";
  allButton.classList.add("filters");

  const allLi = document.createElement("li");
  allLi.appendChild(allButton);
  categoriesContainer.appendChild(allLi);

  for (const category of categories) {
    const li = document.createElement("li");
    const filter = document.createElement("button");

    filter.id = category.id;
    filter.innerText = category.name;
    filter.classList.add("filters");

    li.appendChild(filter);
    categoriesContainer.appendChild(li);
  };

  categoriesContainer.addEventListener("click", filterWorks);
}

/**
 * Filters the works based on the clicked category ID.
 *
 * @param {Event} event - The event object triggered by the click.
 */
function filterWorks(event) {
  const clickedCategoryId = event.target.id;

  if (!clickedCategoryId) return;

  const works = document.querySelectorAll(".works");

  works.forEach(work => {
    if (clickedCategoryId === "all" ? true : work.id === clickedCategoryId) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  });
}

// ADMIN //

/**
 * Displays the admin interface if a token is present in local storage, otherwise fetches categories and adds filters.
 *
 * @return {Promise<void>} A promise that resolves when the admin interface is displayed or filters are added.
 */
async function displayAdmin() {
  const loginLink = document.getElementById('loginLink');

  if (localStorage.getItem("token")) {
    // TODO : afficher le bouton de deconnexion + AFFICHER LA BANNER ADMIN + afficher le bouton modifier les projets

    function toggleLoginLogout() {
      if (localStorage.getItem("token")) {
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", logoutHandler);
      } else {
        loginLink.textContent = "login";
        loginLink.href = "login.html";
        loginLink.removeEventListener("click", logoutHandler);
      }
    }

    function logoutHandler(event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    }

    function addBanner() {
      const banner = document.createElement("div");
      banner.classList.add("banner");

      const icon = document.createElement("i");
      icon.classList.add("fas", "fa-pen-to-square");
      banner.appendChild(icon);

      const bannerText = document.createElement("span")
      banner.innerText = "Mode Création";

      const firstChild = document.body.firstChild;
      document.body.insertBefore(banner, firstChild);


      console.log("Bannière ajoutée :", banner);
      console.log("Icône ajoutée :", icon);
    }

    addBanner();

    toggleLoginLogout();

    } else {
      addFilters(categories);
    }
}

// LOGOUT //

/**
 * Logs out the user by removing the token from local storage and reloading the page.
 */
function logout() {
  localStorage.removeItem("token");
  window.location.reload;
}

// MAIN //

/**
 * Executes the main function.
 * 
 * @return {Promise<void>} A promise that resolves when the main function is completed.
 */
async function main() {
  const works = await fetchWorks();

  await fetchCategories();

  addWorksToHTML(works);
  displayAdmin();
}

main();
