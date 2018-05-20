/**
 * This is an example of how we may do Exception handling in JavaScript.
 */

class Exception
{
    constructor(message)
    {
        this.Message = message;
    }
}

class FailedException extends Exception
{
    constructor(message)
    {
        super(message);
    }
}

function WillThrowException()
{
    throw new FailedException("Something went wrong.");
    // throw new Exception("Generic Exception.");
}

try
{
    WillThrowException();
}
catch (error)
{
    if (error instanceof FailedException)
    {
        console.log("FailedException: " + error.Message);
    }
    else
    {
        console.log("Exception: " + error.Message);
    }
}