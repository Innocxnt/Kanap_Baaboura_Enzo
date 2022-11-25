//--------------------------------------------------------------------------
// Faire le lien entre le produit de la page d'acceuil et SA page Produit
//--------------------------------------------------------------------------

// Ici "params" permet de récupérer l'URL de la page Produit spécifique
const params = new URLSearchParams(document.location.search);
// Ensuite on créer une variable qui va, à partir de l'URL récupérer grâce à "params", appeler l'"id" qu'on recherche (ici l'id est affiché juste après le paramètre "_id" dans l'url)
const id = params.get("_id");
console.log(id);


//--------------------------------------------------------------------------
// Appel des données de l'API avec fetch (GET par défaut)
//--------------------------------------------------------------------------

fetch("http://localhost:3000/api/products")
// Fetch retourne une promese que .json va retourner en json
    .then((res) => res.json())
// Je nomme la promese en "objectProducts"
    .then((objectProducts) => {
        // J'appel ensuite ma fonction
        lesProducts(objectProducts);
    })
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
      });


//--------------------------------------------------------------------------
// fonction d'affichage des détails de produit spécifique de l'API
//--------------------------------------------------------------------------

function lesProducts(product) {
    let imageAlt = document.querySelector("article div.item__img");
    let title = document.querySelector("#title");
    let price = document.querySelector("#price");
    let description = document.querySelector("#description");
    let colorOption = document.querySelector("#colors");
    
    // Ici on veut chercher chaque indice spéficique provenant tableau des produits
    for (let choix of product) {
        if (id === choix._id) {
            // On utilise innerHTML car les modifications apportés comprennent des balises HTML
            imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
            // On utilise textContent car on veut juste modifier le text qui n'a pas de style
            title.textContent = `${choix.name}`;
            price.textContent = `${choix.price}`;
            description.textContent = `${choix.description}`;
            // Modification des balises "option" concernant le choix des couleurs se basant sur celles récupérées de l'API
            for (let color of choix.colors) {
                colorOption.innerHTML += `<option value="${color}">${color}</option>`
            }
        }
    }
}


//------------------------------------------------------------------------
// Création d'objet clientCart
//------------------------------------------------------------------------
// déclaration objet clientCart prêt à être modifiée par les fonctions suivantes d'évènements

let clientCart = {};
// id du procuit
clientCart._id = id;


//------------------------------------------------------------------------
// choix couleur dynamique
//------------------------------------------------------------------------

// définition des variables
let colorChoice = document.querySelector("#colors");
// addEventListener va permettre d'écouter ce qui ce passe au niveau de #colors ("input" event comprend aussi <select>)
colorChoice.addEventListener("input", (ce) => {
    // On défini une variable qui va servir à récuperer la nouvelle valeur après le déclenchement de l'event
    let productColor;
    // Ici on procède à la récupération de la valeur ciblé de "ce"
    productColor = ce.target.value;
    // On ajoute la couleur(nouvelle valeur) sélectionné au panier du client
    clientCart.color = productColor;
    /* Dans le cas où le client souhaite ajouter le même article mais d'une couleur différente, 
    au moment de la modification du changement de couleur, le bouton sera reset et sera affiché comme
    à l'origine*/
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    // Vérification si le changement de couleur s'effectue bien et s'il est bien prit en compte
    console.log(productColor);
    });


//------------------------------------------------------------------------
// choix quantité dynamique
//------------------------------------------------------------------------

// définition des variables
let quantityChoice = document.querySelector("#quantity")
/* addEventListener va permettre d'écouter ce qui ce passe au niveau de #quantity,
quand la valeur de l'élément <input> se voit être modifié, cet élément va continuellement déclencher l'"input" event*/
quantityChoice.addEventListener("input", (qe) => {
    // On défini une variable qui va servir à récuperer la nouvelle valeur après le déclenchement de l'event
    let productQuantity;
    // Ici on procède à la récupération de la valeur ciblé de "qe"
    productQuantity = qe.target.value;
    // On ajoute la quantité(nouvelle valeur) sélectionné au panier du client
    clientCart.quantity = productQuantity;
    /* Dans le cas où le client souhaite modifier/ajouter la quantité de l'article,
    au moment de la modification au niveau de la quantité, le bouton sera reset et sera affiché comme
    à l'origine */
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    // Vérification si le changement de quantité s'effectue bien et s'il est bien prit en compte
    console.log(productQuantity);
});


//------------------------------------------------------------------------------------------
// Instruction d'une condition permettant la validation du click lors de l'ajout au panier
//------------------------------------------------------------------------------------------

// Définition de la variable 
let productChoice = document.querySelector("#addToCart");
/* addEventListener va permettre d'écouter ce qui ce passe au niveau du bouton "ajouter au panier",
losqu'on va effectuer un clic sur le bouton, alors l'évènement "click" sera déclenché */
productChoice.addEventListener("click", () => {
    // Introduction de conditions qui seront vérifiées lors de l'évènement "click" lors de l'ajout au panier
    if (
        // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
        clientCart.quantity < 1 ||
        clientCart.quantity > 100 ||
        // valeur par défaut de la page
        clientCart.quantity === undefined ||
        // Si le client met une couleur et qu'au final il l'enlève
        clientCart.color === "" ||
        clientCart.color === undefined
    ) {
        // Alerte si une/les condition(s) ne sont pas respectée(s)
        alert("Afin que votre choix soit validé, veillez à bien sélectionner une couleur et/ou choisir une quantité entre 1 et 100")
        // Si Les conditions prédéfinies avant sont respectées, alors :
    } else {
        // on appel la fonction addToCart
        addToCart(id, colorChoice.value, quantityChoice.value);
        // On ajoute un style au bouton au clic de celui-ci
        document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
        document.querySelector("#addToCart").textContent = "Produit ajouté !";
    }
});

let panier = [];

function addToCart(id, color, quantity){
    panier.push({id:id, color:color, quantity:quantity});
    console.log(panier);
    if (localStorage.cart){
        console.log("exist")
    } else {
        localStorage.cart = panier
        console.log("exist pas")
    }
}