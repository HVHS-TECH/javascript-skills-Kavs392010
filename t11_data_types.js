/****************************
Name of task: Data Types 
****************************/
console.log("Running t11_data_types.js")
//Variables
var myName= "Kavya";
var myAge= 15;
var myAgeinNextfourMonths= 16;
var userMoney= 1000;
var newDate= new Date(2026, 4, 28);
var currentYear= newDate.getFullYear();
var birthYear= currentYear - myAgeinNextfourMonths;
var futureAge= myAgeinNextfourMonths + 10;
/****************************
Main
****************************/

const OUTPUT = document.getElementById("spaceForJavaScriptOutput");
const NAME_FIELD = document.getElementById("nameField");
const PRODUCT_FIELD = document.getElementById("productField");
const AGE_FIELD = document.getElementById("AgeField");
const PRODUCT_PRICE_FIELD = document.getElementById("ProductPriceField");
const MONEY_FIELD = document.getElementById("MoneyField");

function start(){
    console.log("Hi " + myName + ". As of " + newDate + " I am " + myAge + " years old.");
    console.log("I was born in " + birthYear + "." )
    console.log("In 10 years, I will be " + futureAge + " years old.");
    console.log("I have " + userMoney + " dollars in my bank account. ");
    console.log("I spend half of it, now I have " + userMoney/2 + " dollars left in my account. ");
    console.log("Then I get $3, now I have " + ((userMoney/2)+3) + " dollars in my account. ");

    
    OUTPUT.innerHTML= "<h2>Added by JavaScript</h2>";
    OUTPUT.innerHTML += "<h2>Hello " + myName + "!</h2>";
    OUTPUT.innerHTML += "<h2>Second Paragraph line</h2>";
    OUTPUT.innerHTML += "<h2>Third Paragraph Line</h2>";
    welcome();
    displayProduct("Chocolate", 4);
    displayProduct("Chips", 3);
    displayProduct("Drink", 2.50);
    getFormInput();
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
    let userName = (NAME_FIELD.value);
    OUTPUT.innerHTML = "<p> Your name is " + userName + "</p>";
    let userProduct = (PRODUCT_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product is " + userProduct + "</p>";
    let userAge = (AGE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your age is " + userAge + "</p>";
    let userProductPrice = (PRODUCT_PRICE_FIELD.value);
    OUTPUT.innerHTML += "<p> Your product price is $" + userProductPrice + "</p>";
    let pocketMoney= (MONEY_FIELD.value);
    OUTPUT.innerHTML += "<p> Your pocket money is $" + pocketMoney + "</p>";   
}
