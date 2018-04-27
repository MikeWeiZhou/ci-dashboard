/**
 * This example includes class feature from ES6 (ECMAScript 2015).
 * 
 * Can do:
 *      - static functions
 *      - constructor
 *      - inheritance, including static functions...
 *      - function overriding
 *      - can extend built-in functions
 * 
 * Cons:
 *      - no encapsulation, unless we use a "hacky method", e.g. dumping everything into constructor()
 *      - no strong typing, requires us to validate each and every argument
 *      - no interfaces, but can use base classes with functions that throws errors
 *      - no function overloading
 *          - creating new object with less or more parameters than defined WILL NOT THROW EXCEPTIONS
 *              'use strict'; does not help
 * 
 * CONCLUSION:
 * 
 *  We could use TypeScript (superset of JavaScript), but it requires compilation into JavaScript
 *  before it could be used in production. That extra step will create more work for one(s)
 *  maintaining the product.
 * 
 *  Classes from ES6 is good-enough for our purposes, so we will not be using typescript.
 */

class Animal
{
    static GetPlanetName()
    {
        return "Earth";
    }

    constructor(name)
    {
        this._name = name;
    }

    GetName()
    {
        return this._name;
    }

    ChangeName(name)
    {
        this._name = name;
    }
}

class Pokemon extends Animal
{
    constructor(name, type)
    {
        super(name);
        this._type = type;
    }

    GetType()
    {
        return this._type;
    }

    GetName()
    {
        return super.GetName() + " - " + this._type;
    }
}

// Create new Animal
console.log("Creating new Animal(\"Pikachu\")");
const animal = new Animal("Pikachu");
console.log("var _name: " + animal._name);
console.log("function GetName(): " + animal.GetName());
console.log();

// Call Animal function
console.log("Calling ChangeName(\"Charmander\")");
animal.ChangeName("Charmander");
console.log("var _name: " + animal._name);
console.log("function GetName(): " + animal.GetName());
console.log();

// Call static Animal function
console.log("Calling static method GetPlanetName() from Animal: " + Animal.GetPlanetName());
console.log();



console.log();
console.log();
console.log();



// Create new Pokemon
console.log("Creating new Pokemon(\"Pikachu\", \"Lightning\")");
const pokemon = new Pokemon("Pikachu", "Lightning");
console.log("var _name: " + pokemon._name);
console.log("function GetName(): " + pokemon.GetName());
console.log("function GetType(): " + pokemon.GetType());
console.log();

// Call static Animal function
console.log("Calling static method GetPlanetName() from Pokemon: " + Pokemon.GetPlanetName());
console.log();



console.log();
console.log();
console.log();



// EXPECTED FAIL: Creating animal with no params
// DID NOT FAIL
// _name returns undefined
console.log("Creating new Animal()");
const failedAnimal = new Animal();
console.log("var _name: " + failedAnimal._name);
console.log("function GetName(): " + failedAnimal.GetName());
console.log();

// EXPECTED FAIL: Creating animal with 2 params
// DID NOT FAIL
console.log("Creating new Animal(\"Pikachu\", \"Raichu\")");
const failedAnimal2 = new Animal("Pikachu", "Raichu");
console.log("var _name: " + failedAnimal2._name);
console.log("function GetName(): " + failedAnimal2.GetName());
console.log();