"use strict";

// ***** CONSTANTS ***** //

const galleryContainer = document.querySelector(".gallery");

// ***** VARIABLES ***** //
let projects = [];

// ***** FUNCTIONS ***** //


async function fetchWorks() {
  const url = "http://localhost:5678/api/works";

  const response = await fetch(url);
  projects = await response.json();

  console.log("Projets récupérés :", projects);
}

function addProjects(projects) {
  console.log("Ajout des projets à la galerie...");
  for (const project of projects) {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    figureElement.id = project.id;
    figureElement
    imgElement.src = project.imageUrl;
    imgElement.alt = project.title;

    figcaptionElement.innerText = project.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryContainer.appendChild(figureElement);

  };
}

fetchWorks().then(() => {
  addProjects(projects);
}).catch(error => {
  console.error('Erreur lors de la récupération des projets:', error);
});

