/****************************
Name of task: Introduction to JavaScript
****************************/

console.log("Running t04_debugging.js");

// calculate the area
var area = length * width;

// calculate the perimeter
var perimeter = 2 * length + 2 * width; 

// Set up the size of the page.
var length = 8;
var width = 10;

// Display the results
console.log("The area of a piece of paper with a length of " + length + "cm and a width of " + width + "cm is " + (length*width) + " cm squared.");
console.log("The same piece of paper has a perimeter of " + (2 * length + 2 * width) + " cm.");

// Check, does this result look sensible
if (area > perimeter){
    console.log("Yay, your area is larger, this is right for this example");
}else{
    console.log("Hmm, your perimeter is larger. It shouldn't be for this example");
}
