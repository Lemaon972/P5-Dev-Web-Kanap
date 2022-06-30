const totalPrice = document.getElementById('totalPrice');

let cartData = localStorage.getItem('cart');
let cart;
let contact ={}
cart = JSON.parse(cartData);


class CartItem{

    constructor(){
        this.section = document.getElementById('cart__items');
    }

    renderCartItems(){

        // Insertion des données du localStorage dans une variable, puis on l'ajoute
        cart.forEach(item =>{

            let itemElement = `
            <div class="cart__item__img">
              <img src="${item.img}" alt="${item.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${item.name}</h2>
                <p>${item.color}</p>
                <p>€${item.price * item.quantity}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>${item.quantity} : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Delete</p>
                </div>
              </div>
            </div>
            `;
            const listItem = document.createElement('article');
            listItem.classList.add('cart__item');
            listItem.setAttribute('data-id',`${item.id}`);
            listItem.setAttribute('data-col',`${item.color}`);
            listItem.innerHTML = itemElement;
            this.section.appendChild(listItem);
            Utils.totalCartItems();
            Utils.totalCartPrice();
            
        });

    } 

    userChanges(){

        let quantityBtn = document.querySelectorAll('.itemQuantity');

        // On recherche dans le Dom les quantités qui doivent être changées
        // pour correspondre aux modifications apportées au bouton itemQuantity
        function chnageQuantity(){
            
            quantityBtn.forEach((btn) =>{

                btn.addEventListener('click', () =>{
              
                const btnItemId = btn.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
                const getItemPrice = btn.parentNode.parentNode.previousElementSibling;
                const price = getItemPrice.children[2];
                const btnColor = btn.parentNode.parentNode.previousElementSibling;
                const btnItemColor = btnColor.children[1].textContent;
                const btnItemQuantity = btn.previousElementSibling;
                
                const findIndex = cart.findIndex((cartItems) =>{
                    return cartItems.id === btnItemId && cartItems.color === btnItemColor;
               });

               cart[findIndex].quantity = btn.value;
                btnItemQuantity.innerHTML = `${cart[findIndex].quantity}`;
                price.innerHTML = `€${ cart[findIndex].price * btn.value}`;

                Utils.totalCartPrice();
                Utils.totalCartItems();
                LocalStorage.saveCart();
                });
            });
        }
        //Recherche dans le Dom de la balise article à supprimer et màj du localStorage après suppression
        function deleteItem(){
            let deleteBtn = document.querySelectorAll('.deleteItem');
            
            deleteBtn.forEach((btn) =>{
                btn.addEventListener('click', () => {

                    const articleNode = btn.parentNode.parentNode.parentNode.parentNode;
                    const btnId = articleNode.getAttribute('data-id');

                    const findIndex = cart.findIndex((cartItems) =>{
                        return cartItems.id === btnId;
                   });
                 
                    cart.splice(findIndex,1);                   
                    articleNode.remove();
                    Utils.totalCartPrice();
                    Utils.totalCartItems();
                    LocalStorage.saveCart();
                });
            });
        }
       
        chnageQuantity();
        deleteItem();
    }
}

class UserInputForm{

    confirmOrder(){

        // Champs de saisie du formulaire
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const email = document.getElementById('email');
        const confirmOrderBtn = document.getElementById('order');

        // Erreurs
        const firstNameErr = document.getElementById('firstNameErrorMsg');
        const lastNameErr = document.getElementById('lastNameErrorMsg');
        const addressErr = document.getElementById('addressErrorMsg');
        const cityErr = document.getElementById('cityErrorMsg');
        const emailErr = document.getElementById('emailErrorMsg');

        // REGEX
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regexNames = /^[a-z ,.'-]+$/i;
        const regexaddress = /^\s*\S+(?:\s+\S+){2}/;

        firstNameErr.innerText = ' ';
        lastNameErr.innerText = ' ';
        addressErr.innerText = ' ';
        cityErr.innerText = ' ';
        emailErr.innerText = ' ';

        // Supprimer les messages d'erreurs après correction 
        firstName.addEventListener('focus',() =>{
            firstNameErr.innerText = ' ';
        });

        lastName.addEventListener('focus',() =>{
            lastNameErr.innerText = ' ';
        });

        address.addEventListener('focus',() =>{
            addressErr.innerText = ' ';
        });

        city.addEventListener('focus',() =>{
            cityErr.innerText = ' ';
        });

        email.addEventListener('focus',() =>{
            emailErr.innerText = ' ';
        });


        // Vérification de l'entrée utilisateur est valide
        // Envoi après des données 
        confirmOrderBtn.addEventListener('click', (event) =>{

            event.preventDefault();

            validate(firstName.value,regexNames,'please enter a vaild first name',firstNameErr);
            validate(lastName.value,regexNames,'please enter a vaild last name', lastNameErr);
            validate(address.value,regexaddress,'please enter a vaild address', addressErr);
            validate(city.value,regexNames,'please enter a vaild city', cityErr);
            validate(email.value,regexEmail,'please enter a vaild email address', emailErr);

            if(
                validate(firstName.value,regexNames,'please enter a vaild first name',firstNameErr) === true ||
                validate(lastName.value,regexNames,'please enter a vaild last name', lastNameErr) === true ||
                validate(address.value,regexaddress,'please enter a vaild address', addressErr) === true ||
                validate(city.value,regexNames,'please enter a vaild city', cityErr) === true ||
                validate(email.value,regexEmail,'please enter a vaild email address', emailErr)  === true
            ){
                return 0;

            }else{
            
                const userInfo = [];
                cart.forEach(item =>{
                    userInfo.push(item.id);
                });
    
               const postaData = {
                contact: {
                    firstName: firstName.value.trim(),
                    lastName: lastName.value.trim(),
                    address: address.value.trim(),
                    city: city.value.trim(),
                    email: email.value.trim()
                },
                products: userInfo
               }

               if(cart.length === 0){
                    alert('cart is empty');
               }else{
                    Post.SendData(postaData); 
               }     
            }
        });

        // Vérification de la saisie utilisateur avec REGEX
        function validate(value,regexType,msg,errmsg){
            if(regexType.test(value) === false || value === ''){
                errmsg.innerText = msg;
                errmsg.style.color = 'red';
                return true;
            }else{
                return false;
            }
        }
    }
}

class Post{
    // Transmission des données et redirection vers la page de confirmation
    static async SendData(bodyData){

       fetch(' http://localhost:3000/api/products/order',{
         method: 'post',
         body: JSON.stringify(bodyData),
         headers:{
            'Content-Type':'application/json'
         }
       }).then(function (response){
           return response.text();
       }).then(function (text){
           const parseText = JSON.parse(text);
           window.location.replace(`./confirmation.html?id=${parseText.orderId}`);
       }).catch(function (error){
           console.log(error);
       });
    }
}

class LocalStorage{
    // use to update or set the cart in localStorage 
    static saveCart(){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}


class Utils{
    // used to update the total price of all products in cart 
    static totalCartPrice(){
        const cartItemContentDescription = document.querySelectorAll('.cart__item__content__description');
        let totalItems = 0;
        
        cartItemContentDescription.forEach(item =>{
            totalItems += parseInt(item.children[2].innerText.slice(1));
        });
        totalPrice.innerHTML = totalItems;
    }
    // used to update the total quanitity of items in cart 
    static totalCartItems(){
        const totalQuantity = document.getElementById('totalQuantity');
        let items = 0;
        cart.forEach(item =>{
            items += parseInt(item.quantity);
        });
       totalQuantity.innerHTML = items;
    }
}


// initializes classes renders the products in the cart 
// initializes EventListeners for userchanges and confirmOrder 
document.addEventListener("DOMContentLoaded", () =>{
    const cartItem = new CartItem();
    const order = new UserInputForm();

    cartItem.renderCartItems();
    cartItem.userChanges();
    order.confirmOrder();
});
