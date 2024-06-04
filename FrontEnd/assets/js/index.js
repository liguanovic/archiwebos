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
  works          = await response.json();
}

/**
 * Fetches the categories data from the server and returns it as a promise.
 */
async function fetchCategories() {
  const response = await fetch(URL + "categories");
  categories     = await response.json();
}

// ? ********** DISPLAY WORKS ********** // 

/**
 * Adds works to the HTML gallery.
 *
 * @param {Array} works - An array of work objects containing properties like categoryId, imageUrl, and title.
 */
function addWorksToHTML(works) {

  for (const work of works) {
    const figureElement     = document.createElement("figure");
    const imgElement        = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    figureElement.id            = work.categoryId;
    imgElement.src              = work.imageUrl;
    imgElement.alt              = work.title;
    figcaptionElement.innerText = work.title;
    figureElement.classList.add("works");

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

  const allButton     = document.createElement("button");
  allButton.id        = "all";
  allButton.innerText = "Tous";
  allButton.classList.add("filters");

  const allLi = document.createElement("li");
  allLi.appendChild(allButton);
  categoriesContainer.appendChild(allLi);

  for (const category of categories) {
    const li     = document.createElement("li");
    const filter = document.createElement("button");

    filter.id        = category.id;
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
  const icon          = document.createElement("i");

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
  const editButton      = document.createElement("button");
  const editIcon        = document.createElement("i");

  editIcon.classList.add("fas", "fa-pen-to-square");
  editButton.classList.add("edit-button");

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
  const modal        = document.createElement("div");
  const modalContent = document.createElement("section");
  const modalHeader  = document.createElement("header");
  const h2           = document.createElement("h2");
  const span         = document.createElement("span");
  const ul           = document.createElement("ul");
  const button       = document.createElement("button");

  modal.classList.add("modal");
  modalContent.classList.add("modal-section");
  modalHeader.classList.add("modal-header");
  span.classList.add("close");
  ul.classList.add("modal-body");
  button.classList.add("modal-btn");

  modal.id           = "myModal";
  h2.textContent     = "Galerie photos";
  button.textContent = "Ajouter une photo";
  span.innerHTML     = "&times;";
  
  modalHeader.appendChild(h2);
  modalHeader.appendChild(span);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(ul);
  modalContent.appendChild(button);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  button.addEventListener("click", AddsecondModal);

  openModal();
}

/**
 * Asynchronously opens a modal and fetches works data to add to the modal.
 *
 * @return {Promise<void>} A promise that resolves when the modal is opened and works data is added to the modal.
 */
async function openModal() {
  const modal = document.getElementById("myModal");
  const span  = document.getElementsByClassName("close")[0];

  modal.style.display = "flex";

  await fetchWorks();
  addWorksToModal();

  span.addEventListener("click", closeModal);
  window.addEventListener("click", closeModalIfOutside);
}

function closeModal() {
  const modal         = document.getElementById("myModal");
  modal.style.display = "none";

  clearModalContent();

  const span = document.getElementsByClassName("close")[0];
  span.removeEventListener("click", closeModal);
  window.removeEventListener("click", closeModalIfOutside);
}

function closeModalIfOutside(event) {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    closeModal();
  }
}

function clearModalContent() {
  const modalBody = document.querySelector(".modal-body");

  if (modalBody) {
    modalBody.innerHTML = "";
  }
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
    const figureElement     = document.createElement("figure");
    const imgElement        = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");
    const trashIcon         = document.createElement("i");

    trashIcon.classList.add("fa-solid", "fa-trash-can");


    figureElement.id = work.categoryId;
    imgElement.src   = work.imageUrl;
    imgElement.alt   = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    modalBody.appendChild(figureElement);
    figcaptionElement.appendChild(trashIcon);

    trashIcon.addEventListener("click", deleteWork(work.id, figureElement));
  }
};


function AddsecondModal() {
  const firstModalContent = document.querySelector(".modal-body");
  if (firstModalContent) {
    firstModalContent.style.display = "none";
  }

  const addPictureBtn = document.querySelector(".modal-btn");
  if (addPictureBtn) {
    addPictureBtn.style.display = "none";
  }

  const modalContent    = document.querySelector(".modal-section");
  const h2              = document.querySelector(".modal-header h2");
  const form            = document.createElement("form");
  const addWorks        = document.createElement("div");
  const iconImage       = document.createElement("i");
  const imgLabel        = document.createElement("label");
  const imgInput        = document.createElement("input");
  const addWorksText    = document.createElement("p");
  const titleInput      = document.createElement("input");
  const titleLabel      = document.createElement("label");
  const categorieSelect = document.createElement("select");
  const categorieLabel  = document.createElement("label");
  const submitInput     = document.createElement("input");
  const line            = document.createElement("hr");
  const arrowLeft       = document.createElement("i");

  h2.innerText = "Ajout photo";
  addWorksText.innerText = "jpg, png : 4mo max";
  form.classList.add("modal-form");
  addWorks.classList.add("add-works");
  iconImage.classList.add("fa-regular", "fa-image");
  submitInput.classList.add("form-btn");
  arrowLeft.classList.add("fa-solid", "fa-arrow-left");

  imgInput.type              = "file";
  imgInput.id                = "image";
  imgInput.accept            = ".jpg, .jpeg, .png";
  imgLabel.textContent       = "+ Ajouter photo";
  imgLabel.htmlFor           = "image";
  titleInput.type            = "text";
  titleInput.id              = "title-input";
  titleLabel.textContent     = "Titre";
  titleLabel.htmlFor         = "title";
  categorieSelect.id         = "category-input";
  categorieSelect.name       = "category";
  categorieSelect.innerHTML  = `<option value="" disabled hidden selected></option>
                                <option value="1">Objets</option>
                                <option value="2">Appartements</option>
                                <option value="3">Hôtels & restaurants</option>`;
  categorieLabel.textContent = "Categorie";
  categorieLabel.htmlFor     = "category-input";
  submitInput.type           = "submit";
  submitInput.value          = "Valider";

  modalContent.appendChild(form);
  modalContent.appendChild(arrowLeft);
  form.appendChild(addWorks);
  addWorks.appendChild(iconImage);
  addWorks.appendChild(imgLabel);
  addWorks.appendChild(imgInput);
  addWorks.appendChild(addWorksText);
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(categorieLabel);
  form.appendChild(categorieSelect);
  form.appendChild(line);
  form.appendChild(submitInput);

  previousModal();
  imgInput.addEventListener("change", previewImage);
}

function previousModal() {
  const arrowElement = document.querySelector(".fa-arrow-left");

  arrowElement.addEventListener("click", () => {
    const secondModalContent = document.querySelector(".modal-form");
    if (secondModalContent) {
      secondModalContent.style.display = "none";
    }

    const secondModalBtn = document.querySelector(".form-btn");
    if (secondModalBtn) {
      secondModalBtn.style.display = "none";
    }

    const firstModalContent = document.querySelector(".modal-body");
    if (firstModalContent) {
      firstModalContent.style.display = "";
    }

    const addPictureBtn = document.querySelector(".modal-btn");
    if (addPictureBtn) {
      addPictureBtn.style.display = "";
    }
  });
  }

/**
 * Deletes a work with the specified ID from the API.
 *
 * @param {string} workId - The ID of the work to delete.
 * @return {Promise<void>} A promise that resolves when the work is successfully deleted, or rejects with an error if the deletion fails.
 */
function deleteWork(id, img) {
  return async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          accept: '*/*',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      
      img.remove();
    } catch (error) {
      console.error("an error occurred during photo deletion:", error);
    }
  }
}

async function postWorks(e) {
  e.preventDefault();
  const titleInput = document.getElementById("title-input");
  const categoryInput = document.getElementById("category-input");
  const imageInput = document.getElementById("image");

  if (!titleInput.value || !categoryInput.value || !imageInput.files || !imageInput.files[0]) {
    alert("Veuillez remplir tous les champs du formulaire");
    return;
  }

  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);
  formData.append("image", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        accept: '*/*',
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (response.ok) {
      closeModal();
      await fetchWorks(); 
      addWorksToHTML(works);
      alert("Le projet a été ajouté avec succès !");
    } else {
      throw new Error("Une erreur est survenue lors de l'envoi du formulaire");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire :", error);
    alert("Une erreur est survenue lors de l'envoi du formulaire");
  }
}

function previewImage() {
  const preview = document.querySelector(".add-works");
  const input = document.querySelector("#image");
  const iconImage = document.querySelector(".fa-image");
  const previewLabel = document.querySelector(".add-works label");
  const previewParag = document.querySelector(".add-works p");

  const Files = input.files;

  previewLabel.remove();
  previewParag.remove();
  iconImage.remove();

  for (const file of Files) {
    const imgContainer = document.createElement("figure");
    const image = document.createElement("img");

    const reader = new FileReader();
    reader.onload = function(event) {
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);

    preview.appendChild(imgContainer);
    imgContainer.appendChild(image);
  }
}

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
