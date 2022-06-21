// Défini $items pour assigner comme enfants tous les objets HTML

const $items = document.getElementById("items")

const ITEMS_PER_PAGE = 8

// Requête FETCH API

const retrieveKanapsData = async () => fetch("http://localhost:3000/api/products")
  .then(res => res.json())
    .then(data => data)
    .catch(err => console.log("Le serveur à un problème", err))

// Créer les autres élements HTML et leurs contenus

const createKanapArticle = kanap => {
  const $kanapArticle = document.createElement("article")

  const $kanapImg = document.createElement("img")
  $kanapImg.setAttribute("src", kanap.imageUrl)
  $kanapImg.setAttribute("alt", kanap.altTxt)

  const $kanapName = document.createElement("h3")
  $kanapName.classList.add("productName")
  $kanapName.innerText = kanap.name

  const $kanapDescription = document.createElement("p")
  $kanapDescription.classList.add("productDescription")
  $kanapDescription.textContent = kanap.description

  $kanapArticle.appendChild($kanapImg)
  $kanapArticle.appendChild($kanapName)
  $kanapArticle.appendChild($kanapDescription)

  return $kanapArticle
}

// Fonction appelé par MAIN() avec kanap contenant les DATA api
// Créer l'element A HTML avec l'ID de chaque ITEM comme URL, appelle la prochaine function
// Et la définie comme enfant

const createKanapItem = kanap => {
  const $kanapItem = document.createElement("a")
  $kanapItem.setAttribute("href", `./product.html?id=${kanap._id}`)

  const $kanapArticle = createKanapArticle(kanap)

  $kanapItem.appendChild($kanapArticle)

  return $kanapItem
}

// récupère les data de l'API dans kanapsData
// Boucle FOR pour chaque ITEM =>
// Appelle createKanapItem pour créer les objets HTML en passant le contenu de l'API
// Défini comme enfant de $items

  const main = async () => {
    const kanapsData = await retrieveKanapsData()

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        if (kanapsData[i]) {
            $items.appendChild(createKanapItem(kanapsData[i]))
        }
    }
  }

main()