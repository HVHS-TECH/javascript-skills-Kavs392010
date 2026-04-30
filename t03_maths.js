/****************************
Name of task: Introduction to JavaScript
****************************/
console.log("Running t02_variables.js")
//Variables
var myName= "Kavya";
var myAge= 15;
var userMoney= 1000;
var newDate= new Date(2026, 4, 28);
var currentYear= newDate.getFullYear();
var birthYear= currentYear - myAge;
/****************************
Main
****************************/
console.log("Hi " + myName + ". As of " + newDate + " you are " + myAge + " years old. You have $" + userMoney + " dollars.")

/****************************
Functions
****************************/