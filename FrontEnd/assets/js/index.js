"use strict";

// ! ******************** CONSTANTS ******************** //

const URL = "http://localhost:5678/api/";

// ! ******************** VARIABLES ******************** //

let categories = [];
let works = [];

// ! ******************** FUNCTIONS ******************** //

// ? ********** FETCH ********** // 

/**
 * Fetches the works data from the server and returns it as a promise.
 *
 * @return {Promise<Array>} A promise that resolves to an array of works data.
 */
async function fetchWorks() {
  const response = await fetch(URL + "works");
  works = await response.json();
}

/**
 * Fetches the categories data from the server and returns it as a promise.
 */
async function fetchCategories() {
  const response = await fetch(URL + "categories");
  categories = await response.json();
}

// ? ********** DISPLAY WORKS ********** // 

/**
 * Adds works to the HTML gallery.
 *
 * @param {Array} works - An array of work objects containing properties like categoryId, imageUrl, and title.
 */
function addWorksToHTML(works) {

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

// ? ********** FILTERS ********** // 

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

// ? ********** ADMIN ********** // 

/**
 * Toggles the login/logout functionality based on the presence of a token in local storage.
 */
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

/**
 * Logout handler function.
 *
 * @param {Event} event - The event object triggered by the click.
 */
function logoutHandler(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.reload();
}

/**
 * Creates a banner element and adds it to the beginning of the document body.
 */
function addBanner() {
  const banner = document.createElement("div");
  banner.classList.add("banner");

  const bannerContent = document.createElement("span");
  const icon = document.createElement("i");

  icon.classList.add("fas", "fa-pen-to-square");
  bannerContent.appendChild(icon);
  bannerContent.appendChild(document.createTextNode("Mode édition"));

  banner.appendChild(bannerContent);
  const firstChild = document.body.firstChild;
  document.body.insertBefore(banner, firstChild);
}

/**
 * Adds an edit button to the portfolio header, which, when clicked, opens a modal with the content of the modal being added by the `displayModal` function.
 */
function addEditButton() {
  const portfolioHeader = document.querySelector("#portfolio header");

  const editButton = document.createElement("button");
  const editIcon   = document.createElement("i");

  editIcon.classList.add("fas", "fa-pen-to-square");

  editButton.appendChild(editIcon);
  editButton.insertAdjacentText('beforeend', "modifier");
  editButton.addEventListener("click", displayModal);
  portfolioHeader.appendChild(editButton);
}

/**
 * Displays the admin interface if a token is present in local storage, otherwise fetches categories and adds filters.
 *
 * @return {Promise<void>} A promise that resolves when the admin interface is displayed or filters are added.
 */
async function displayAdmin() {
  const loginLink = document.getElementById('loginLink');

  if (localStorage.getItem("token")) {
    addBanner();
    addEditButton();
    toggleLoginLogout();

  } else {
    addFilters(categories);
  }
}

// ? ********** MODAL ********** // 

/**
 * Asynchronously adds a modal content to the document body.
 *
 * @return {Promise<void>} A promise that resolves when the modal content is added.
 */
async function displayModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "myModal";
  document.body.appendChild(modal);

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const span = document.createElement("span");
  span.classList.add("close");
  span.innerHTML = "&times;";
  const h2 = document.createElement("h2");
  h2.textContent = "Galerie photos";

  modalHeader.appendChild(span);
  modalHeader.appendChild(h2);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  const modalButton = document.createElement("button");
  modalButton.textContent = "Ajouter une photo";

  modalFooter.appendChild(modalButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modal.appendChild(modalContent);

  openModal();
}

/**
 * Asynchronously opens a modal and fetches works data to add to the modal.
 *
 * @return {Promise<void>} A promise that resolves when the modal is opened and works data is added to the modal.
 */
async function openModal() {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];

  modal.style.display = "flex";

  /**
   * Sets the onclick event handler for the span element to hide the modal.
   *
   * @param {Event} event - The click event.
   */
  span.onclick = function () {
    modal.style.display = "none";
  }

    /**
     * Sets the onclick event handler for the window to hide the modal if the clicked element is the modal itself.
     *
     * @param {Event} event - The click event.
     */
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  await fetchWorks();
  addWorksToModal();
}

/**
 * Adds works to the modal by creating figure, img, figcaption, and trashIcon elements,
 * and appending them to the modal body. The function logs a message to the console.
 */
function addWorksToModal() {
  console.log("Ajout des projets au modal...");

  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";

  for (const work of works) {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");
    const trashIcon = document.createElement("i");

    trashIcon.classList.add("fa-solid", "fa-trash-can");


    figureElement.id = work.categoryId;
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    modalBody.appendChild(figureElement);
    figcaptionElement.appendChild(trashIcon);

    // trashIcon.addEventListener("click", deleteWork(work.id, figureElement));
  }
};

/**
 * Deletes a work with the specified ID from the API.
 *
 * @param {string} workId - The ID of the work to delete.
 * @return {Promise<void>} A promise that resolves when the work is successfully deleted, or rejects with an error if the deletion fails.
 */
async function deleteWork(workId) {
  console.log(workId);
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete work");
    }

    console.log(`Work with ID ${workId} deleted successfully`);
  } catch (error) {
    console.error("Error during deletion:", error);
  }
}

document.querySelectorAll(".fa-trash-can").forEach(icon => {
  console.log(icon);
  icon.addEventListener("click", () => {
    const workId = icon.closest(".image-container").id;
    console.log(workId);
    deleteWork(workId);
  });
});

// ? ********** LOGOUT ********** // 

/**
 * Logs out the user by removing the token from local storage and reloading the page.
 */
function logout() {
  localStorage.removeItem("token");
  window.location.reload;
}

// ? ********** MAIN ********** // 

/**
 * Executes the main function.
 * 
 * @return {Promise<void>} A promise that resolves when the main function is completed.
 */
async function main() {
  await fetchWorks();
  await fetchCategories();

  addWorksToHTML(works);
  displayAdmin();
}

main();
