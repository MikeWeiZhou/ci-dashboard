/**
 * Examples of NOT operator in JavaScript.
 * 
 * CONCLUSION:
 * 
 *  Using NOT operator in JavaScript can have too many meanings.
 * 
 *  Refrain from using it if possible unless dealing with boolean.
 */

function IsNot(somevar)
{
    return !somevar;
}

// returns false
console.log("IsNot(\"1\"): " + IsNot("1"));

console.log();
console.log();
console.log();

// all returns true
console.log("IsNot(\"\"): " + IsNot(""));
console.log("IsNot(false): " + IsNot(false));
console.log("IsNot(undefined): " + IsNot(undefined));
console.log("IsNot(null): " + IsNot(null));
console.log("IsNot(0): " + IsNot(0));