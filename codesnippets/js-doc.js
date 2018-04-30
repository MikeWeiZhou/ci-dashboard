/**
 * Examples of how to use JSDoc.
 * 
 * https://en.wikipedia.org/wiki/JSDoc
 * 
 * Visual Studio Code uses JSDoc for IntelliSense to suggest parameter types.
 * 
 * CONCLUSION:
 * 
 *  USE IT EVEN IF IT IS REDUNDANT.
 */

class InvalidNameException
{
    constructor(msg)
    {
        this._msg = msg;
    }
}

class Person
{
    /**
     * Creates a new Person object.
     * @param {string} name Name of person.
     * @param {number} age Age of person.
     * @param {boolean} isDead Person is deceased.
     */
    constructor(name, age, isDead)
    {
        this._name = name;
        this._age = age;
        this._isDead = isDead;

        _validate();
    }

    /**
     * Validates the person.
     * @throws {InvalidNameException} Invalid Name Exception
     */
    _validate()
    {
        if (typeof(this._name) !== "string")
        {
            throw new InvalidNameException("Name is not a string!");
        }
    }

    /**
     * Return name of person.
     * @returns {string} Name of person.
     */
    GetName()
    {
        return this._name;
    }

    /**
     * Change name of person.
     * @param {string} name New name of person.
     */
    ChangeName(name)
    {
        this._name = name;
    }
}