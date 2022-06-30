const productImage = document.querySelector('.item__img');
const selectColor = document.getElementById('colors');
const priceEl = document.getElementById('price');
const descriptionEl = document.getElementById('description');
const titleEl = document.getElementById('title');
const pageTitle = document.querySelector('title');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');
const imgTag = document.createElement('img');

const getProductId = location.search.substring(4);  
let cartData = localStorage.getItem('cart');
let cart;

if(cartData === null){
   cart = [];
}else{
    cart = JSON.parse(cartData);
}

class Products{
    // Récupération des données avec une requète GET 
    async fetchProducts(){
        
        try{
            let result = await fetch('http://localhost:3000/api/products');
            let data = await result.json();

            return data;
            
        }catch(error){
            console.log(error);
        }
    }    
}

// On affiche
class UI{

  
    renderProducts(data){
        // On utilise les données pour afficher l'image et les informations du produit
        data.forEach(function(data){

            if(getProductId === data._id){
                
                priceEl.innerText =  data.price;
                descriptionEl.innerText = data.description;
                titleEl.innerText = data.name;
                pageTitle.innerText = data.name;

                imgTag.src = data.imageUrl;
                imgTag.alt = data.altTxt;
                imgTag.className = "new__img";

                productImage.appendChild(imgTag);
                // On recupère dans le tableau de couleur les valeurs
                // On affiche les couleurs dans le menu déroulant
                data.colors.forEach(function(color){
                    const option = document.createElement('option');
                    option.innerText = color;
                    selectColor.appendChild(option);
                });
            }
        });
    }
    
    addToCart(){

        // On créé l'article à partir des données choisies par l'utilisateur
        addToCartBtn.addEventListener('click', ()=>{
            
            const item = {
                id : getProductId,
                name: titleEl.innerText,
                price : priceEl.innerText,
                img: imgTag.src,
                description: descriptionEl.innerText,
                altTxt: imgTag.alt,
                color : selectColor.value,
                quantity  : quantityInput.value
            }
            // Vérification si l'article est déjà dans le panier
            const findIdex = cart.findIndex((cartItems) =>{
                return cartItems.id === item.id && cartItems.color === item.color;
           });

           console.log(findIdex);

           if(cart === []){
                console.log("Premier article dans le panier");
                cart.push(item);
            }else if(findIdex === -1){
                cart.push(item);
                console.log(cart);
            }else{
                // Si l'article est déjà dans le panier on rajoute la quantité
                console.log(findIdex);
                const newQuantity = parseInt(cart[findIdex].quantity) + parseInt(item.quantity);
                cart[findIdex].quantity = String(newQuantity);

                console.log(cart);
            }  
            LocalStorage.saveCart(cart);
            window.location.assign("cart.html");
        });
    }
}

class LocalStorage{
    // On place les produits dnas le loacalstorage
    static saveCart(){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// On initilaise les classes et lance la requète http 
// On commence le rendu des produits 
// On utilise EvvenListener sur le bouton Ajouter au panier
document.addEventListener("DOMContentLoaded", () =>{

    const ui = new UI();
    const products = new Products();

    products.fetchProducts().then(data =>{
    ui.renderProducts(data);
    }).then(() =>{
        ui.addToCart();
    })

});