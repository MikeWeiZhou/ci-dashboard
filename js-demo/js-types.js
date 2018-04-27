/**
 * Examples of the types of different variables
 */

class Beast {}          // object
function aFunction() {} // function
var anInt = 5;          // number
var aFloat = 5.5;       // number
var anInfinity = 5/0;   // number
var aNaN = 5/"string";  // number || value: NaN
var aString = "string"; // string
var aChar = 'a';        // string
var aBool = false;      // boolean
var newVar;             // undefined || value: undefined

console.log("typeof an instance of a class: " + typeof(new Beast()));
console.log("typeof function: " + typeof(aFunction));
console.log("typeof int: " + typeof(anInt));
console.log("typeof float: " + typeof(aFloat));
console.log("typeof infinity: " + typeof(anInfinity));
console.log("typeof not a number: " + typeof(aNaN) + " || value: " + aNaN);
console.log("typeof string: " + typeof(aString));
console.log("typeof char: " + typeof(aChar));
console.log("typeof boolean: " + typeof(aBool));
console.log("typeof declared, not initialized variable: " + typeof(newVar) + " || value: " + newVar);