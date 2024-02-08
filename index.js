import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//this section is for the firebase database that was created to store the data from the grocery list 
const appSettings = {
    databaseURL: "https://realtime-database-c34ce-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

//in this section we assign some variables that can not be reassined, hence the "const". the variables include the initializing of the app and ensuring the app is linked to a shopping list in the database 
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

//this section is for the main interactive parts of the app, the input field, the button and the appended list that's added into the cart. this const keyword section ensures that these are called via Id  
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

//in this section the clicking function for clearing the input field is implemented in order to indicate that the item has been added to your cart so that you can "cross" it off the list.
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

// this section of the code is for the arrays of the shopping list
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
//this section is the fucntion for clearing the input field 
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

//this section is for the function that appends the shopping list to the innerhtml then clear it onces its been clicked  
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}