// Défini des elements du DOM

const $cart__items = document.getElementById("cart__items");
const $cart = document.getElementById("cart");

// Défini des variables vides pour contourner leurs limites d'appel

let cart = "";
let number = +"";
let price = +"";
let firstNameVerification = false;
let lastNameVerification = false;
let addressVerification = false;
let cityVerification = false;
let emailVerification = false;
let formVerification = false;
// Requête API avec ID

const retrieveApiData = async () =>
  fetch(`http://localhost:3000/api/products/${itemData.id}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("we need a problem houston", err));

// Créer les élements HTML pour les images

const createCartItemImg = (cartItem) => {
  const $cart__item__img = document.createElement("div");
  $cart__item__img.classList.add("cart__item__img");

  const $img = document.createElement("img");
  $img.setAttribute("src", itemApiData.imageUrl);
  $img.setAttribute("alt", itemApiData.altTxt);

  $cart__item__img.appendChild($img);

  return $cart__item__img;
};

// Créer les élements HTML pour la description

function createCartItemContentDescription() {
  const $cart__item__content__description = document.createElement("div");
  $cart__item__content__description.classList.add(
    "cart__item__content__description"
  );

  const $itemName = document.createElement("h2");
  $itemName.textContent = itemApiData.name;

  const $itemColor = document.createElement("p");
  $itemColor.textContent = itemData.color;
  const $itemPrice = document.createElement("p");
  $itemPrice.textContent = itemApiData.price + " €";

  $cart__item__content__description.appendChild($itemName);
  $cart__item__content__description.appendChild($itemColor);
  $cart__item__content__description.appendChild($itemPrice);

  return $cart__item__content__description;
}

// Créer élements HTML pour les paramètres de quantité

const createCartItemContentSettingsQuantity = (cartItem) => {
  const $cart__item__content__settings__quantity =
    document.createElement("div");
  $cart__item__content__settings__quantity.classList.add(
    "cart__item__content__settings__quantity"
  );

  const $pQuantity = document.createElement("p");
  $pQuantity.textContent = "Qté :";

  const $itemQuantity = document.createElement("input");
  $itemQuantity.setAttribute("type", "number");
  $itemQuantity.classList.add("itemQuantity");
  $itemQuantity.setAttribute("name", "itemQuantity");
  $itemQuantity.setAttribute("min", "1");
  $itemQuantity.setAttribute("max", "100");
  $itemQuantity.setAttribute("value", itemData.quantity);

  $cart__item__content__settings__quantity.appendChild($pQuantity);
  $cart__item__content__settings__quantity.appendChild($itemQuantity);

  return $cart__item__content__settings__quantity;
};

// Créer élements HTML pour le bouton supprimer

const createCartItemContentSettingsDelete = (cartItem) => {
  const $cart__item__content__settings__delete = document.createElement("div");
  $cart__item__content__settings__delete.classList.add(
    "cart__item__content__settings__delete"
  );

  const $deleteItem = document.createElement("p");
  $deleteItem.classList.add("deleteItem");
  $deleteItem.textContent = "Supprimer";

  $cart__item__content__settings__delete.appendChild($deleteItem);

  return $cart__item__content__settings__delete;
};

// Créer élement HTML pour les paramètres
// Appelle les fontions qui créer son contenu
// Créer les enfants du DOM

const createCartItemContentSettings = (cartItem) => {
  const $cart__item__content__settings = document.createElement("div");
  $cart__item__content__settings.classList.add("cart__item__content__settings");

  const $cart__item__content__settings__quantity =
    createCartItemContentSettingsQuantity(cartItem);
  const $cart__item__content__settings__delete =
    createCartItemContentSettingsDelete(cartItem);

  $cart__item__content__settings.appendChild(
    createCartItemContentSettingsQuantity(
      $cart__item__content__settings__quantity
    )
  );
  $cart__item__content__settings.appendChild(
    createCartItemContentSettingsDelete($cart__item__content__settings__delete)
  );

  return $cart__item__content__settings;
};

// Créer éléments HTML pour le CONTENT
// Appelle les fontions qui créer son contenu
// Assigne les enfants

const createCartItemContent = (cartItem) => {
  const $cart__item__content = document.createElement("div");
  $cart__item__content.classList.add("cart__item__content");

  const $cart__item__content__description =
    createCartItemContentDescription(cartItem);
  const $cart__item__content__settings =
    createCartItemContentSettings(cartItem);

  $cart__item__content.appendChild(
    createCartItemContentDescription($cart__item__content__description)
  );
  $cart__item__content.appendChild(
    createCartItemContentSettings($cart__item__content__settings)
  );

  return $cart__item__content;
};

// Créer éléments HTML pour l'ARTICLE
// Appelle les fontions qui créer son contenu
// Assigne les enfants

const createCartItemArticle = (cartItem) => {
  const $cartItemArticle = document.createElement("article");
  $cartItemArticle.classList.add("cart__item");
  $cartItemArticle.setAttribute("data-id", cartItem.id);
  $cartItemArticle.setAttribute("data-color", cartItem.color);

  const $cart__item__img = createCartItemImg(cartItem);
  const $cart__item__content = createCartItemContent(cartItem);

  $cartItemArticle.appendChild(createCartItemImg($cart__item__img));
  $cartItemArticle.appendChild(createCartItemContent($cart__item__content));

  return $cartItemArticle;
};

// Affiche la quantité d'article
// Si = 0, défini à 0
// Sinon, pour chaque item : récupère la quantité, l'additionne et l'Affiche
// Affiche le prix TOTAL contenu dans la variable PRICE

const cartPrice = () => {
  const totalQuantity = document.getElementById("totalQuantity");

  if (cart === null) {
    totalQuantity.textContent = 0;
    console.log("Aucun produit dans le panier");
  } else {
    for (
      let numberOfArticles = 0;
      numberOfArticles <= cart.length - 1;
      numberOfArticles++
    ) {
      let numberInCart = +cart[`${numberOfArticles}`].quantity;
      number = number + numberInCart;
      totalQuantity.textContent = number;
    }
  }

  const totalPrice = (document.getElementById("totalPrice").textContent =
    price);
};

// Récupère l'ID et color de l'item concerné
// Défini l'index de l'item pour le localiser
// Modifie la quantité si + ou -
// Met à jour le localStorage
// Met à jour la quantité et prix total affiché en appelant cartPrice

const quantityInputsChange = async (e) => {
  let targetItem = e.target.closest("article");
  let targetId = targetItem.dataset.id;
  let targetColor = targetItem.dataset.color;

  let itemIndex = cart.findIndex(
    (item) => item.id === targetId && item.color === targetColor
  );

  if (cart[`${itemIndex}`].quantity < e.target.value) {
    price = price + itemApiData.price;
  } else {
    price = price - itemApiData.price;
  }

  cart[`${itemIndex}`].quantity = e.target.value;

  localStorage.setItem("cartItems", JSON.stringify(cart));

  number = 0;

  itemData.id = targetId;

  itemApiData = await retrieveApiData();

  cartPrice();
};

// Récupère l'ID et color de l'item concerné
// Défini l'index de l'item pour le localiser
// Récupère la quantité et le prix
// Met à jour les données pour la suppression
// Supprime l'item du DOM et du tableau
// Met a jour localStorage
// Met à jour la quantité et prix total affiché en appelant cartPrice

const deleteItem = async (e) => {
  console.log("DELETE : ");
  let targetItem = e.target.closest("article");
  console.log(targetItem);
  let targetId = targetItem.dataset.id;
  let targetColor = targetItem.dataset.color;
  console.log(targetId);

  let itemIndex = cart.findIndex(
    (item) => item.id === targetId && item.color === targetColor
  );

  console.log(itemIndex);

  let targetQuantity = document.querySelector(
    `article[data-id='${targetId}'][data-color='${targetColor}'] input.itemQuantity`
  );
  let targetPrice = document.querySelector(
    `article[data-id='${targetId}'] div.cart__item__content__description > p:last-child`
  );

  console.log("TARGET QUANTITY : ", targetQuantity.value);
  console.log("TARGET PRICE : ", targetPrice.textContent);

  targetPriceValue = targetPrice.textContent.replace(" €", "");

  number = number - targetQuantity.value;
  targetQuantPrice = targetPriceValue * targetQuantity.value;
  price = price - targetQuantPrice;

  console.log(targetQuantPrice);

  $cart__items.removeChild(targetItem);
  cart.splice(itemIndex, 1);

  localStorage.setItem("cartItems", JSON.stringify(cart));

  number = 0;

  cartPrice();
};

// Récupère tout les id à vérifier
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const confirmOrderBtn = document.getElementById("order");

// Erreurs
const firstNameErr = document.getElementById("firstNameErrorMsg");
const lastNameErr = document.getElementById("lastNameErrorMsg");
const addressErr = document.getElementById("addressErrorMsg");
const cityErr = document.getElementById("cityErrorMsg");
const emailErr = document.getElementById("emailErrorMsg");

// REGEX
const regexEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexNames = /^[a-z ,.'-]+$/i;
const regexaddress = /^\s*\S+(?:\s+\S+){2}/;

firstNameErr.innerText = " ";
lastNameErr.innerText = " ";
addressErr.innerText = " ";
cityErr.innerText = " ";
emailErr.innerText = " ";

// Supprimer les messages d'erreurs après correction
firstName.addEventListener("focus", () => {
  firstNameErr.innerText = " ";
});

lastName.addEventListener("focus", () => {
  lastNameErr.innerText = " ";
});

address.addEventListener("focus", () => {
  addressErr.innerText = " ";
});

city.addEventListener("focus", () => {
  cityErr.innerText = " ";
});

email.addEventListener("focus", () => {
  emailErr.innerText = " ";
});

// Vérification de l'entrée utilisateur est valide
// Envoi après des données
confirmOrderBtn.addEventListener("click", (event) => {
  event.preventDefault();

  validate(
    firstName.value,
    regexNames,
    "Veuillez saisir votre prénom",
    firstNameErr
  );
  validate(
    lastName.value,
    regexNames,
    "Veuillez saisir votre nom",
    lastNameErr
  );
  validate(
    address.value,
    regexaddress,
    "Veuillez saisir votre addresse",
    addressErr
  );
  validate(city.value, regexNames, "Veuillez saisir votre ville", cityErr);
  validate(email.value, regexEmail, "Veuillez saisir votre email", emailErr);

  if (
    validate(
      firstName.value,
      regexNames,
      "Veuillez saisir un prénom valide",
      firstNameErr
    ) === true ||
    validate(
      lastName.value,
      regexNames,
      "Veuillez saisir un nom valide",
      lastNameErr
    ) === true ||
    validate(
      address.value,
      regexaddress,
      "Veuillez saisir une adresse valide",
      addressErr
    ) === true ||
    validate(
      city.value,
      regexNames,
      "Veuillez saisir une ville valide",
      cityErr
    ) === true ||
    validate(
      email.value,
      regexEmail,
      "Veuillez saisir un email valide",
      emailErr
    ) === true
  ) {
    return 0;
  } else {
    const userInfo = [];
    cart.forEach((item) => {
      userInfo.push(item.id);
    });

    const postaData = {
      contact: {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        address: address.value.trim(),
        city: city.value.trim(),
        email: email.value.trim(),
      },
      products: userInfo,
    };
  }
});

// Vérification de la saisie utilisateur avec REGEX
function validate(value, regexType, msg, errmsg) {
  if (regexType.test(value) === false || value === "") {
    errmsg.innerText = msg;
    console.log("Aucun produit dans le panier");
  } else {
    formVerification = true;
    return false;
  }
}

// Requête API POST
// Si valide, redirige vers une URL comportant l'orderID

function postOrder(order) {
  console.log(order);
  const postOrder = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (server) {
      localStorage.clear();
      orderId = server.orderId;
      if (server.orderId != "") {
        console.log(orderId);
        location.href = "confirmation.html?id=" + server.orderId;
      }
      console.log(orderId);
    })
    .catch((err) => {
      console.log("Problème avec fetch : " + err.message);
    });
}

// Créer l'ordre de commande avec le contenu de la requête POST

function createOrder(event) {
  event.preventDefault();
  console.log("order");

  if (formVerification === true) {
    let products = [];

    for (let productsN = 0; productsN < cart.length - 1; productsN++) {
      products.push(cart[`${productsN}`].id);
    }

    const order = {
      contact: {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      },
      products: products,
    };

    console.log("products ", products);
    console.log("REQUETE JSON : ", order);

    postOrder(order);
  } else {
    console.log("Form is not valid");
  }
}

// Écoute les champs du formualire pour vérification RegEx

// Écoute le click du bouton de commande pour appeler createOrder

const orderBtn = document
  .getElementById("order")
  .addEventListener("click", createOrder);

// Parse les données du localStorage
// Si localStorage contient des données, récupère le nombre d'entrées
// FOR => Pour chaque entrée, récupère les data API, calcul le prix, créer enfant du DOM

const main = async () => {
  cart = JSON.parse(localStorage.getItem("cartItems"));

  if (cart !== null) {
    const numberOfCartItems = cart.length - 1;

    for (let i = 0; i <= numberOfCartItems; i++) {
      itemData = cart[`${i}`];

      itemApiData = await retrieveApiData();

      quantPrice = itemApiData.price * itemData.quantity;

      price = price + quantPrice;

      $cart__items.appendChild(createCartItemArticle(itemData));
    }
  }

  // Appelle cartPrice avec les data API

  cartPrice(cart);

  // Créer pour chaque entrée un eventListener du boutton supprimer

  deleteItemElements = document.getElementsByClassName("deleteItem");
  for (let p = 0; p <= deleteItemElements.length - 1; p++) {
    deleteItemElements[`${p}`].addEventListener("click", deleteItem);
  }

  // Créer pour chaque entrée un eventListener de la quantité

  quantityInputsElements = document.querySelectorAll(
    "div.cart__item__content__settings__quantity > input"
  );
  for (let q = 0; q <= quantityInputsElements.length - 1; q++) {
    quantityInputsElements[`${q}`].addEventListener(
      "change",
      quantityInputsChange
    );
  }
};

main();
