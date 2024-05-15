"use strict";

// ***** CONSTANTS ***** //

const galleryContainer = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".filters");

// ***** VARIABLES ***** //


// ***** FUNCTIONS ***** //


async function fetchWorks() {
  const url = "http://localhost:5678/api/works";

  const response = await fetch(url);
  let works = await response.json();
  console.log("Projets récupérés :", works);
  return works;
}

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
    galleryContainer.appendChild(figureElement);

  };
}

async function fetchFilters() {
  const url = "http://localhost:5678/api/categories";

  const response = await fetch(url);
  let categories = await response.json();
  console.log("Categories :", categories);
  return categories;
}

function addFilters(categories) {
  for (const category of categories) {
    const li = document.createElement("li");
    const filter = document.createElement("button");

    filter.id = category.id;
    filter.innerText = category.name;
    filter.classList.add("filters");

    li.appendChild(filter);
    categoriesContainer.appendChild(li);
  };

  filterWorks();
}

function filterWorks() {
  categoriesContainer.addEventListener("click", (event) => {
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
  });
}


async function main() {
  let works = await fetchWorks();
  addWorksToHTML(works);

  let categories = await fetchFilters();
  addFilters(categories);
}

main();