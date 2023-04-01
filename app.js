"use strict";

const headerEl = document.getElementById("header");
const sectionEl = document.getElementById("webbutik");
// kundvagn
const sectionCartEl = document.getElementById("showCart"); // function(toogle-show/hide kundvagn)
const kundvagnbuttonEl = document.getElementById("kundvagnbutton"); // knappen(toggla kundvagn)
const tillagdEl = document.getElementById("tillagd"); // skriver HTML
const totalSumCartEl = document.getElementById("totalSumCart"); // skriver HTML
const checkoutEl = document.getElementById("checkout"); // skriver HTML
const checkformEl = document.getElementById("checkform"); // skriver HTML
// Checkout
const sectionCheckoutEl = document.getElementById("showCheckout"); // funtion(show checkout sectionen)
const cartItemNumberEl = document.getElementById("cartItemNumber");
// form
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("epost");
const addressEl = document.getElementById("address");
const shippingEl = document.getElementById("shipping");

 


fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {

    let categoryButtons = document.getElementsByClassName("catergory-button");
    for (let i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener("click", function() {
            getContent(data, this.getAttribute("data-category"));
        });
    }
    getContent(data, "all");
})
    .catch(error => console.log(error));


// funktioner
function getContent(data, selectedCategory) {

    const content = data.filter(content => {
        if (selectedCategory === "all") {
            return true;
        } else if (selectedCategory === content.category) {
            return true;
        } else {
        return false;
    }});

    console.log(content);

   
    sectionEl.innerHTML = "";

    for (let i = 0; i < content.length; i++) {

        sectionEl.innerHTML += `

        <article class="articleFrame">
            <h1>${content[i].title}</h1>
            <p><b>Category:</b> ${content[i].category}</p><br>
            <img src="${content[i].image}" alt="pic">
            <p><b>Price:</b>${content[i].price} kr</b></p><br>
            <p id="description"><b>Product description: </b>${content[i].description}</p>
            <br>
            <p><b>Product-id:</b> ${content[i].id}</p>
            <br>
            <p><b>Rating:</b> ${content[i].rating.rate} </p><br><b>count:</b> ${content[i].rating.count}</p>
            <br>
            <input type="button" value="Lägg till" onClick="addItem('${content[i].id}', '${content[i].title.replace("'","")}', '${content[i].price}')">
            <hr>
        </article> 
        `;

    }
}


//  POST - Lägg till artikel

    function addUser() {

        console.log('funktion körs...')

        // Hämta in data från <form>
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const address = addressEl.value.trim();
        const shipping = shippingEl.value.trim();

        if (!name || !email || !address || !shipping) {
            console.log("Name, Address or Email is missing")
            return;
        }

        const idproducts = productarray.map(content => {
            return {
                "stringValue": content.id 
            }
        });

        // användarens värden blir JSON-objekt

        let body = JSON.stringify(
            {
            "fields": {
                "Name": { 
                    "stringValue": name
                },
                "email": {
                    "stringValue": email
                },
                "address": {
                    "stringValue": address
                },
                "shipping": {
                    "stringValue": shipping
                },
                "idproducts": {
                    "arrayValue": {
                        "values": idproducts
                    } 
                }
            }   
        }
    );
    
        // Skicka API - fetch-anrop med POST-metod

        fetch("https://firestore.googleapis.com/v1/projects/projektapi-217b0/databases/(default)/documents/orders", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
            
            console.log(body);

            localStorage.clear();   
            setTimeout(() => location.reload(), 2000); 

};

// Skapar Array för produkter 

let productarray = JSON.parse(localStorage.getItem("output")) || [];

// addItem() = adderar produkter till kundvagn
function addItem(id, item, price) {
    
// push 
    productarray.push({
        id,
        item,
        price});

    // Konvertera array-objektet till JSON, lagra i variabel json    
  
    let json = JSON.stringify(productarray); 

    // Spara json-datan i localstorage                                                                   
    localStorage.setItem("output", json);

    cartItemCounter();  //  antal varor vi lägger i.     
    updateCart();       // uppdaterar kundvagn
    
    }

    function updateCart() {
        
        let sum = 0;
        let html = "";
        for (let i = 0; i < productarray.length; i++) {
            let item = productarray[i];
            sum += parseFloat(item.price);
            html += 
            `<br>
            <tr>
                <td>${item.item}</td>
                <td>|</td>
                <td><b>${item.price} kr</b></td>
                <td><input type="button" value="-" onClick="deleteOneItem('${item.id}','${i}')"></td>
            </tr>`;
        }

        tillagdEl.innerHTML = html;
        totalSumCartEl.innerHTML = `
        <hr id="cartHR">
        <b>Total Summa: <span id="totalPrice">${sum.toFixed(2)} kr</b></span>
        <input type="button" id="checkoutButton" value="gå till kassan" onClick="checkOut(${sum.toFixed(2)}, showCheckout(), hideWebbutik())">`;
    
    }

    
    updateCart();        
    cartItemCounter();   
    
function checkOut(sum) {

    checkoutEl.innerHTML = "";
    checkformEl.innerHTML = "";

    for (let i = 0; i < productarray.length;i++) {
        console.log(productarray[i]);

    checkoutEl.innerHTML += `
        <p>
        <b>Produkt id: ${productarray[i].id}<br>
        Produkt: ${productarray[i].item}<br>
        Pris: ${productarray[i].price}kr<br>
        <br>
        </p>
        <hr>
    `
}

    checkformEl.innerHTML += `
    <hr id="cartHR">
    <p><b>Total summa: ${sum} kr <br><p>
    <br>
    `
}

function cartItemCounter() {   
    //  antal varor som läggs i kundvagn   
    let count = cartItemNumberEl.innerHTML = productarray.length;
    return count;
}


function deleteOneItem(id, index) {

    productarray.findIndex(item => item.id === id); 
  
    productarray.splice(index, 1);
  
    let json = JSON.stringify(productarray);
    localStorage.setItem("output", json);
  
    cartItemCounter();
    updateCart();
}
  

function hideCart() {
    sectionCartEl.classList.toggle("showCart");
}


function showCheckout() {
    sectionCheckoutEl.classList.add("showCheckout");
}

function hideWebbutik() {
    sectionEl.classList.add("webbutik");
}


// eventhanterare

kundvagnbuttonEl.addEventListener("click", hideCart);
  
      


