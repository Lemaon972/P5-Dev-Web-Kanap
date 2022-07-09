// Défini des elements du DOM

const $kanapItemImg = document.getElementsByClassName("item__img");
const $kanapItemColors = document.getElementById("colors");
const $pageTitle = document.querySelector("title");

// Récupère ID dans URL

const params = window.location.href;
var url = new URL(params);
var id = url.searchParams.get("id");

// Créer un tableau cartItems avec item
let item = localStorage.getItem("cartItems");
if (item === null) {
  cartItems = [];
  console.log("mayo");
} else {
  cartItems = JSON.parse(item);
  console.log("Ketchup");
}
// Requête API avec ID

const receptionKanapData = async () =>
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log("we need a problem houston", err));

// Créer élement IMG, setAttribute avec data API
// Créer un enfant du DOM et retourner l'objet

const createKanapImg = (kanap) => {
  const $kanapImg = document.createElement("img");
  $kanapImg.setAttribute("src", kanap.imageUrl);

  $kanapItemImg[0].appendChild($kanapImg);

  return $kanapImg;
};

// Boucle FOR pour chaque couleur de l'ID data API
// Créer élement option, setAttribute avec data API
// Créer un enfant du DOM

const createKanapColors = (kanap) => {
  for (let i = 0; i <= kanap.colors.length - 1; i++) {
    const $kanapColors = document.createElement("option");
    $kanapColors.setAttribute("value", kanap.colors[`${i}`]);
    $kanapColors.textContent = kanap.colors[`${i}`];

    $kanapItemColors.appendChild($kanapColors);
  }
};

// Appelle les functions
// Remplis les éléments du DOM avec data API

const createKanapItem = (kanap) => {
  const $kanapImg = createKanapImg(kanap);

  const $kanapTitle = document.getElementById("title");
  $kanapTitle.textContent = kanap.name;
  $pageTitle.textContent = kanap.name;
  const $kanapDescription = document.getElementById("description");
  $kanapDescription.textContent = kanap.description;

  const $kanapPrice = document.getElementById("price");
  $kanapPrice.textContent = kanap.price;

  const $kanapColors = createKanapColors(kanap);
};

// Récupère color et quantity sélectionnées
// Si quantity = 0, ne rien faire (pour ne créer de ligne vide)
// Si l'ID ET color sont déja dans le tableau, trouve l'index et modifie la quantité et met à jour le localStorage
// Sinon push l'entrée dans le tableau et met à jour le localStorage

function addToCartData(event) {
  const selectedColor = document.getElementById("colors").value;

  const selectedQuantity = document.getElementById("quantity").value;

  if (selectedQuantity === "0" || selectedQuantity === "") {
    alert("Veuillez saisir la quantité");
  } else if (selectedColor === "") {
    alert("veuillez saisir choisir une couleur");
  } else if (
    cartItems.find((item) => item.id === id && item.color === selectedColor)
  ) {
    console.log("Un de plus");
    let itemIndex = cartItems.findIndex(
      (item) => item.id === id && item.color === selectedColor
    );

    console.log(itemIndex);

    const cartItemQuantity = +cartItems[`${itemIndex}`].quantity;
    const quantityToAdd = +selectedQuantity;

    cartItems[`${itemIndex}`].quantity = `${cartItemQuantity + quantityToAdd}`;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    location.href = "cart.html";
  } else {
    console.log("Un nouveau");
    cartItems.push({
      id: id,
      color: selectedColor,
      quantity: selectedQuantity,
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    location.href = "cart.html";
  }
}

// Récupère le button dans le DOM
// Ècoute son click event et appelle addToCartData

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", addToCartData);

// Récupère les data API dans kanapData
// Appelle createKanapItem avec les data API

const main = async () => {
  const kanapData = await receptionKanapData();

  createKanapItem(kanapData);
};

main();
