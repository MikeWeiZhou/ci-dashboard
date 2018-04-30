/**
 * Examples of weak equality comparator in JavaScript (==)
 * 
 * CONCLUSION:
 * 
 *  The weak equality comparator (==) sometimes implicitly casts variables into different
 *  types.
 * 
 *  THEREFORE, use the identical comparator (===) that ensures the types are equivalent.
 */

function IsEquals(var1, var2)
{
    return (var1 == var2);
}

function IsIdentical(var1, var2)
{
    return (var1 === var2);
}

// all are not equal
console.log("IsEquals(null, 0): " + IsEquals(null, 0));
console.log("IsEquals(null, \"null\"): " + IsEquals(null, "null"));
console.log("IsEquals(false, \"false\"): " + IsEquals(false, "false"));
console.log("IsEquals(true, 2): " + IsEquals(true, 2));

console.log();
console.log();
console.log();

// all are equal
console.log("IsEquals(null, undefined): " + IsEquals(null, undefined));
console.log("IsEquals(false, 0): " + IsEquals(false, 0));
console.log("IsEquals(true, 1): " + IsEquals(true, 1));
console.log("IsEquals('1', 1): " + IsEquals('1', 1));

console.log();
console.log();
console.log();

// CALLS IsIdentical; All are not identical
console.log("IsIdentical(null, undefined): " + IsIdentical(null, undefined));
console.log("IsIdentical(false, 0): " + IsIdentical(false, 0));
console.log("IsIdentical(true, 1): " + IsIdentical(true, 1));
console.log("IsIdentical('1', 1): " + IsIdentical('1', 1));
