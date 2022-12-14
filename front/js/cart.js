// Nous voulons différencier la page cart et la page confirmation grace à location.href
const page = document.location.href;

//--------------------------------------------------------------------------
// Appel des données de l'API avec fetch (GET par défaut)
//--------------------------------------------------------------------------
// SI on se situe bien sur la page panier, alors on fait appel aux ressources de l'api product
/* page.match("cart") va permettre de comprendre si on est sur la page panier en analysant l'URL et en vérifiant s'il y a bien la string "cart",
si c'est confirmé alors on est bien dans la page panier */
if (page.match("cart")) {
    fetch("http://localhost:3000/api/products")
        // Fetch retourne une promese que .json va retourner en json
        .then((res) => res.json())
        // Je nomme la promese en "objectProducts"
        .then((objectProducts) => {
            // Vérification que tout est bien affiché
            console.log(objectProducts);
             // J'appel ensuite ma fonction
            displayCart(objectProducts);
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
          });
} else {
    console.log("page confirmation affichée")
}

//---------------------------------------------------------------------------------------------------------
// Création de la fonction displayCart qui va déterminer les conditions d'affichage des produits du panier
//---------------------------------------------------------------------------------------------------------

function displayCart(products) {
    // on récupère le panier (qui est en string car provient du localStorage) qu'on convertit en object JS
    let cart = JSON.parse(localStorage.getItem("storageCart"));
    // S'il y a un panier avec une taille differante de 0 (donc supérieure à 0)
    if (cart && cart.length != 0) {
     // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
     for (let choice of cart) {
        console.log(choice);
        for (let g = 0, h = products.length; g < h; g++) {
          if (choice._id === products[g]._id) {
            // on créer ainsi qu'ajouter à chaque clé les valeurs à panier qui vont servir aux valeurs dataset
            choice.name = products[g].name;
            choice.price = products[g].price;
            choice.image = products[g].imageUrl;
            choice.description = products[g].description;
            choice.alt = products[g].altTxt;
          }
        }
     }
     // On appel la fonction display() qui va utiliser les données de cart(définies juste au dessus)
    display(cart);
    } else {
        // Si le panier se retrouve vide, on créer un h1 qui va servire d'information
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = 
        "Vous n'avez pas d'article dans votre panier.";
    }
    // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage au besoin
    changeQuantity();
    deleteProduct();
}

//--------------------------------------------------------------
// Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------

// on créer la fonction display() avec un params qui va permettre l'appel de données à appliqué à cette fonction (donc utilisera les données de "cart")
function display(indexé) {
    // on déclare et on pointe la zone d'affichage
    let zoneCart = document.querySelector("#cart__items");
    // on créer l'affichage des produits du panier via un map et on introduit les dataset(défini plus tôt) dans le code
    zoneCart.innerHTML += indexé.map((choice) => 
    `<article class="cart__item" data-id="${choice._id}" data-color="${choice.color}" data-quantity="${choice.quantity}" data-price="${choice.price}"> 
    <div class="cart__item__img">
      <img src="${choice.image}" alt="${choice.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choice.name}</h2>
        <span>couleur : ${choice.color}</span>
        <p data-price="${choice.price}">${choice.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choice.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choice._id}" data-couleur="${choice.color}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide

  // reste à l'écoute grâce à la fonction suivante pour modifier l'affichage au besoin
  totalProduct();
}


//--------------------------------------------------------------------------
// fonction changeQuantity on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------------------

function changeQuantity() {
  const cart = document.querySelectorAll(".cart__item");
  // Nous allons maintenant écouter ce qu'il se passe dans itemQuantity d'un article précis
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      // On vérifie la nouvelle valeur(et sa validation) après le clique ainsi que son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("storageCart"));
      // On créer ensuite une boucle afin d'appliquer la nouvelle quantité du produit au panier grâce à sa nouvele valeur validé auparavant
      for (article of panier)
      if (
        article._id === cart.dataset.id &&
        cart.dataset.colors === article.colors
      ) {
        article.quantity = eq.target.value;
        localStorage.storageCart = JSON.stringify(panier);
        // On appliqué ensuite le changement de quantité à la dataset qui s'en charge
        cart.dataset.quantity = eq.target.value;
        // Et enfin on joue la fonction afin d'actualiser les données
        totalProduct();
      }
    });
  });
}


//-------------------------------------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//-------------------------------------------------------------------------------------------

function deleteProduct() {
  // On déclare la variable (ici on va viser le "supprimer" dans <article> cart__item > <p> deleteItem)
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  // On vise CHAQUE élément de cartdelete
  cartdelete.forEach((cartdelete) => {
    // Maintenant on écoute si un clic se fait sur la zone visé auparavant d'un articlé concerné
    cartdelete.addEventListener("click", () => {
      // appel de la ressource du localStorage
      let cart = JSON.parse(localStorage.getItem("storageCart"));
      for (let d = 0, c = cart.length; d < c; d++)
        if (
          cart[d]._id === cartdelete.dataset.id &&
          cart[d].colors === cartdelete.dataset.colors
        ) {
          // on déclare une variable qui sera utile à la supréssion
          const num = [d];
          // on va ensuite créer un tableau miroir en ne contenant pas l'article supprimé auparavant
          let newCart = JSON.parse(localStorage.getItem("storageCart"));
          // On supprime donc 1 élement à l'indice "num" (.splice() permet cette modification de contenu directement sur le tableau)
          newCart.splice(num, 1);
          // SI le nouveau panier créer devient vide après suppréssion d'article(s)(donc un panier vide)
          if (newCart && newCart.length == 0) {
          // Si le panier se retrouve vide, on créer un h1 qui va servire d'information
          document.querySelector("#totalQuantity").innerHTML = "0";
          document.querySelector("#totalPrice").innerHTML = "0";
          document.querySelector("h1").innerHTML = 
          "Vous n'avez pas d'article dans votre panier.";
          }
          // On renvoit le nouveau panier (newcart()) converti dans le localStorage pour ensuite jouer la fonction
          localStorage.storageCart = JSON.stringify(newCart);
          totalProduct();
          // Et enfin on refresh la page afin que la page se charge sans le produit supprimé
          return location.reload();
        }
    });
  });
}


//---------------------------------------------------------------------------
// fonction pour afficher le nombre total de produit ainsi que le prix total
//---------------------------------------------------------------------------

function totalProduct() {
  // déclaration de variables qui seront un nombre (une poiur le nombre de produit et l'autre pour le prix total)
  let totalArticle = 0;
  let totalPrice = 0;
  // On cible un élément en particulier
  const cart = document.querySelectorAll(".cart__item");
  // On veut désigner pour chaque élément de cart
  cart.forEach((cart) => {
    // On récupère les quantitées des produits grâve à la dataset pour ensuite redéfinir la valeur de totalArticle
    totalArticle += JSON.parse(cart.dataset.quantity)
    // Pour le coût total il faut créer une multiplication (un opérateur) via les datasets
    totalPrice += cart.dataset.quantity * cart.dataset.price;
  });
  // Je vais donc cibler l'endroit où on veut afficher le nombre d'article
  document.getElementById("totalQuantity").textContent = totalArticle;
  // Je vais donc cibler l'endroit où on veut afficher le prix total
  document.getElementById("totalPrice").textContent = totalPrice;
}


//--------------------------------------------------------------
// Section formulaire
//--------------------------------------------------------------

// Les données du client seront stockées dans ce tableau pour la commande qui sera dans la page panier
if (page.match("cart")) {
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);
    // On cible des éléments inputs, on veut leur attribuer une nouvelle classe, ainsi ils agiront tous de la même manière quand on fera appel au regex sur cette classe
    // Ici on cible les élements inputs "firstName", "lastName" et "city"
    var firstName = document.querySelector("#firstName");
    firstName.classList.add("regex_text");
    var lastName = document.querySelector("#lastName");
    lastName.classList.add("regex_text");
    var city = document.querySelector("#city");
    city.classList.add("regex_text");
    // on pointe l'input address
    var address = document.querySelector("#address");
    address.classList.add("regex_address");
    // on pointe l'input email
    var email = document.querySelector("#email");
    email.classList.add("regex_email");
    // on pointe les éléments qui ont la classe .regex_text
    var regexText = document.querySelectorAll(".regex_text");
    // modification du type de l'input type email à text à cause d'un comportement de l'espace blanc non voulu vis à vis de la regex 
    document.querySelector("#email").setAttribute("type", "text");
}


//--------------------------------------------------------------
//regex 
//--------------------------------------------------------------

// /^ début regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 31 caratères (nombre de caractère maximum sur carte identité) {1,31} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexLetter = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// /^ début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères (nombre de caractère maximum sur carte identité) {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexNumberLetter = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regCheckedEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;


//----------------------------------------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//----------------------------------------------------------------------------------------------
// Si on est bien sur la page cart
if (page.match("cart")) {
  // POUR chaque élément de regexText
  regexText.forEach((regexText) =>
    // On écoute ce qu'il se passe à chaque input de regexText (ceux qu'on a défini plus tôt)
    regexText.addEventListener("input", (e) => {
      // value sera la valeur de l'input en dynamique
      value = e.target.value;
      // regNormal sera la valeur de la réponse regex, 0 ou -1
      let regNormal = value.search(regexLetter);
      // SI regNormal est égal à 0
      if (regNormal === 0) {
        contactClient.firstName = firstName.value;
        contactClient.lastName = lastName.value;
        contactClient.city = city.value;
      }
      // SI la ville / prénom / nom ne soit pas vide et que regNormal est égal à 0
      if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
      ) {
        contactClient.regexNormal = 3;
      } else {
        contactClient.regexNormal = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      colorRegex(regNormal, value, regexText);
      checkedClick();
    })
  );
}


//--------------------------------------------------------------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//--------------------------------------------------------------------------------------------
texteInfo(regexLetter, "#firstNameErrorMsg", firstName);
texteInfo(regexLetter, "#lastNameErrorMsg", lastName);
texteInfo(regexLetter, "#cityErrorMsg", city);


//----------------------------------------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//----------------------------------------------------------------------------------------------

if (page.match("cart")) {
  let regexAddress = document.querySelector(".regex_address");
  regexAddress.addEventListener("input", (e) => {
    // value sera la valeur de l'input en dynamique
    value = e.target.value;
    // regNormal sera la valeur de la réponse regex, 0 ou -1
    let regAddress = value.search(regexNumberLetter);
    if (regAddress === 0) {
      contactClient.address = address.value;
    }
    if (contactClient.address !== "" && regAddress === 0) {
      contactClient.regexAddress = 1;
    } else {
      contactClient.regexAddress = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    colorRegex(regAddress, value, regexAddress);
    checkedClick();
  });
}


//--------------------------------------------------------------------------------------------------
// le champ écouté via la regex regexNumberLetter fera réagir, grâce à texteInfo, la zone concernée
//--------------------------------------------------------------------------------------------------
texteInfo(regexNumberLetter, "#addressErrorMsg", address);


//--------------------------------------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex
//--------------------------------------------------------------------------------------------
if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    // value sera la valeur de l'input en dynamique
    value = e.target.value;
    // https://webdevdesigner.com/q/what-characters-are-allowed-in-an-email-address-65767/ mon adresse doit avoir cette forme pour que je puisse la valider
    let regMatch = value.match(regMatchEmail);
    // quand le resultat sera correct, le console log affichera une autre réponse que null; regChecked sera la valeur de la réponse regex, 0 ou -1
    let regChecked = value.search(regCheckedEmail);
    if (regChecked === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    colorRegex(regChecked, value, regexEmail);
    checkedClick();
  });
}


//------------------------------------
// texte sous champ email
//------------------------------------
if (page.match("cart")) {
  email.addEventListener("input", (e) => {
    // value sera la valeur de l'input en dynamique
    value = e.target.value;
    let regMatch = value.match(regMatchEmail);
    let regChecked = value.search(regCheckedEmail);
    // si value est toujours un string vide et la regex différente de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (value === "" && regMatch === null) {
      document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // si value n'est plus un string vide et la regex différente de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
    } else if (regChecked !== 0) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
    } else if (value != "" && regMatch == null) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else {
      document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    }
  });
}


//---------------------------------------------------------------------------------------------------------------
// fonction colorRegex qui modifira la couleur de l'input par remplissage tapé, aide visuelle et accessibilité
//---------------------------------------------------------------------------------------------------------------

// on détermine une valeur de départ à value qui sera un string
let valueListen = "";
// fonction à 3 arguments réutilisable, la regex, la valeur d'écoute, et la réponse à l'écoute
function colorRegex(regSearch, valueListen, inputAction) {
  // si value est toujours un string vide et la regex différente de 0 (regex à -1 et le champ est vide mais pas d'erreur)
  if (valueListen === "" && regSearch != 0) {
    inputAction.style.backgroundColor = "white";
    inputAction.style.color = "black";
    // si value n'est plus un string vide et la regex différente de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
  } else if (valueListen !== "" && regSearch != 0) {
    inputAction.style.backgroundColor = "rgb(220, 50, 50)";
    inputAction.style.color = "white";
    // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
  } else {
    inputAction.style.backgroundColor = "rgb(0, 138, 0)";
    inputAction.style.color = "white";
  }
}


//------------------------------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//------------------------------------------------------------------------------------
function texteInfo(regex, target, zoneListen) {
  if (page.match("cart")) {
    zoneListen.addEventListener("input", (e) => {
    // value sera la valeur de l'input en dynamique
    value = e.target.value;
    index = value.search(regex);
    // si value est toujours un string vide et la regex différente de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (value === "" && index != 0) {
      document.querySelector(target).textContent = "Veuillez renseigner ce champ.";
      document.querySelector(target).style.color = "white";
      // si value n'est plus un string vide et la regex différente de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
      } else if (value !== "" && index != 0) {
      document.querySelector(target).innerHTML = "Reformulez cette donnée";
      document.querySelector(target).style.color = "white";
      // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
      } else {
      document.querySelector(target).innerHTML = "Caratères acceptés pour ce champ.";
      document.querySelector(target).style.color = "white";
      }
    });
  }
}


//----------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//----------------------------------------------------------------
let order = document.querySelector("#order");
// la fonction sert à valider le clic de commande de manière interactive
function checkedClick() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme = contactRef.regexNormal + contactRef.regexAddress + contactRef.regexEmail;
  // regexNormal = 3(nom/prénom/ville) , regexAddress = 1 , regexEmail = 1
  if (somme === 5) {
    order.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    order.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}


//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
if (page.match("cart")) {
  order.addEventListener("click", (e) => {
    // empeche de recharger la page, on prévient le reload du bouton
    e.preventDefault();
    checkedClick();
    sendPacket();
  });
}


//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------

// définition du panier qui ne comportera que les id des produits choisi du local storage
let cartId = [];
function arrayId() {
// appel des ressources
let cart = JSON.parse(localStorage.getItem("storageCart"));
// récupération des id produit dans panierId
if (cart && cart.length > 0) {
  for (let indice of cart) {
    cartId.push(indice._id);
    console.log(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide!");
}
}


//------------------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//------------------------------------------------------------------------

let contactRef;
let finalOrder;
function packet() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  // définition de l'objet commande
  finalOrder = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: cartId,
  };
}

//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
function sendPacket() {
  arrayId();
  packet();
  // vision sur le packet que l'on veut envoyer
  console.log(finalOrder);
  let somme = contactRef.regexNormal + contactRef.regexAddress + contactRef.regexEmail;
  // si le cartId contient des articles et que le clic est autorisé
  if (cartId.length != 0 && somme === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        // Après validation, on r'envoi à la page confirmation
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
        // On vide les différents storages
        sessionStorage.clear();
        localStorage.clear();
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}