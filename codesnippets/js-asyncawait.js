/**
 * Example of how async functions never block even with await.
 */

async function WaitAWhile(ms)
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(() =>
        {
            resolve();
        }, ms);
    });
}

async function PrintOne()
{
    await WaitAWhile(5000);
    console.log("PrintOne()");
}

async function PrintTwo()
{
    await WaitAWhile(2000);
    console.log("PrintTwo()");
}

PrintOne();
PrintTwo();

// output:
// PrintTwo()
// PrintOne()

// Some magical scheduling is happening as
// PrintOne() is invoked first, but PrintTwo()
// is outputted first due to it's shorter wait time