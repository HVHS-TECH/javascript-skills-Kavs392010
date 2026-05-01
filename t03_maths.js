/****************************
Name of task: Introduction to JavaScript
****************************/
console.log("Running t02_variables.js")
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
console.log("Hi " + myName + ". As of " + newDate + " I am " + myAge + " years old.")
console.log("I was born in " + birthYear + "." )
console.log("In 10 years, I will be " + futureAge + " years old.")
console.log("I have " + userMoney + " dollars in my bank account. ")
console.log("I spend half of it, now I have " + userMoney/2 + " dollars left in my account. ")
console.log("Then I get $3, now I have " + ((userMoney/2)+3) + " dollars in my account. ")
/****************************
Functions
****************************/