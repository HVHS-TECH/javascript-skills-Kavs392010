/****************************
Name of task: For Loop
****************************/
console.log("Running t15_for_loop.js")
//Variables
var myName= "Kavya";
var myAge= 15;
var myAgeinNextfourMonths= 16;
var userMoney= 1000;
var newDate= new Date(2026, 4, 28);
var currentYear= newDate.getFullYear();
var birthYear= currentYear - myAgeinNextfourMonths;
var futureAge= myAgeinNextfourMonths + 10;
var userProductprice;
var pocketMoney;
var change;
/****************************
Main
****************************/

const OUTPUT = document.getElementById("spaceForJavaScriptOutput");
const NAME_FIELD = document.getElementById("nameField");
const PRODUCT_FIELD = document.getElementById("productField");
const AGE_FIELD = document.getElementById("AgeField");
const PRODUCT_PRICE_FIELD = document.getElementById("ProductPriceField");
const MONEY_FIELD = document.getElementById("MoneyField");
const FEEDBACK_FIELD = document.getElementById("FeedbackField");
const CHOOSE_FIELD = document.getElementById("ChooseField");

function start(){
    console.log("Hi " + myName + ". As of " + newDate + " I am " + myAge + " years old.");
    console.log("I was born in " + birthYear + "." )
    console.log("In 10 years, I will be " + futureAge + " years old.");
    console.log("I have " + userMoney + " dollars in my bank account. ");
    console.log("I spend half of it, now I have " + userMoney/2 + " dollars left in my account. ");
    console.log("Then I get $3, now I have " + ((userMoney/2)+3) + " dollars in my account. ");

    welcome();
    displayProduct("Chocolate", 4);
    displayProduct("Chips", 3);
    displayProduct("Drink", 2.50);
    displayProduct("MacBook", 1500);
}
  
/****************************
Functions
****************************/
function welcome(){
    OUTPUT.innerHTML += "<p>Welcome to My shop</p>";  
}

function displayProduct(_name, _price){
    OUTPUT.innerHTML += "<p>" + _name + " costs $" + _price + "</p>";
}

function getFormInput(_name,_product,_age,_price,_money){
    OUTPUT.innerHTML += "<p>Welcome to My shop</p>";  
    let userName = (NAME_FIELD.value);
    OUTPUT.innerHTML += "<p> Your name is " + userName + "</p>";
    let userProduct = (PRODUCT_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product is " + userProduct + "</p>";
    let userAge = Number(AGE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your age is " + userAge + "</p>";
    let userProductprice = Number(PRODUCT_PRICE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product price is $" + userProductprice + "</p>";
    let pocketMoney= Number(MONEY_FIELD.value);
    OUTPUT.innerHTML += "<p> Your pocket money is $" + pocketMoney + "</p>";   


if (userProductprice > pocketMoney){
    console.log("You cannot buy " + userProduct + " because it is too expensive for you.");
}
else if (userProductprice == pocketMoney){
    console.log("You can buy " + userProduct + " but you will have no money left.");
}
else{
    console.log("You can buy " + userProduct + " and you will have $" + (pocketMoney - userProductprice) + " left.");
}   

}

function calculateChange(_productPrice, _pocketMoney){
    OUTPUT.innerHTML = "<p>Welcome to My shop</p>";  
    let userName = (NAME_FIELD.value);
    OUTPUT.innerHTML += "<p> Your name is " + userName + "</p>";
    let userProduct = (PRODUCT_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product is " + userProduct + "</p>";
    let userAge = Number(AGE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your age is " + userAge + "</p>";
    let userProductprice = Number(PRODUCT_PRICE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product price is $" + userProductprice + "</p>";
    let pocketMoney= Number(MONEY_FIELD.value);
    OUTPUT.innerHTML += "<p> Your pocket money is $" + pocketMoney + ".</p>";
    let change= Number(pocketMoney - userProductprice);
    OUTPUT.innerHTML += "<p> Your change is $" + change + ".</p>";

    if (change < 0){
        console.log("You have a loss of $" + change + " because you cannot afford the product.");
        OUTPUT.innerHTML += "<p> You have a loss of $" + change + " because you cannot afford the product.</p>";
    }
    else if (change == 0){
        console.log("You have no change left.");
        OUTPUT.innerHTML += "<p> You have no change left.</p>";
    }
    else{
        console.log("You have a change of $" + change + " because you can afford the product.");
        OUTPUT.innerHTML += "<p> You have a change of $" + change + " because you can afford the product.</p>"; 
    } 
    let classArray = ["You loath chocolate", "Chocolate is meh", "Chocolate is pretty good", "Chocolate is the best thing EVER!!!"];
    let choice = (CHOOSE_FIELD.value);
    OUTPUT.innerHTML += "You choose : " + classArray[choice] + "<br>";
    let classArray1 = ["I hate MacBooks", "I don't like MacBooks", "MacBooks are fine", "MacBooks are pretty cool", "MacBooks are the best thing EVER!!!"];
    let userFeedback = (FEEDBACK_FIELD.value);
    OUTPUT.innerHTML += "You choose : " + classArray1[userFeedback] + "<br>";
}