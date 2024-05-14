"use strict";

// ***** CONSTANTS ***** //

const galleryContainer = document.querySelector(".gallery");

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

    figureElement.id = work.id;
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.innerText = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryContainer.appendChild(figureElement);

  };
}

async function main(){
  let works = await fetchWorks();
  addWorksToHTML(works);
}

main();