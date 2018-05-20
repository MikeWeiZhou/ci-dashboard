/**
 * Example of how to use Promises along with async-await functions.
 * 
 * The code styling used is not conventional. This code styling is used
 * so it is easier to visually see the different components of Promises.
 */

// BASE REQUIREMENT: Something that returns a Promise
function DoSomething(isSuccess)
{
    return new Promise
    (
        // does something asynchronously
        // then resolves or rejects
        function (resolve, reject)
        {
            if (isSuccess)
            {
                resolve("success");
            }
            else
            {
                reject("reject");
            }
        }
    );
}

// METHOD 1 : Using async-await function
async function CallDoSomethingUsingAsyncAwait()
{
    try
    {
        const response = await DoSomething(false); // expected "success"
        console.log(response);
    }
    catch (error)
    {
        console.log(error);
    }
}
CallDoSomethingUsingAsyncAwait(); // gives "reject"

// METHOD 2 : Using the old .then().catch()
function CallDoSomethingUsingThenCatch()
{
    DoSomething(true)
        .then
        (
            function (success)
            {
                console.log(success);
            }
        )
        .catch
        (
            function (error)
            {
                console.log(error);
            }
        );
}
CallDoSomethingUsingThenCatch(); // gives "success"
