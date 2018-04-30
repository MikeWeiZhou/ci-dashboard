/**
 * This demonstrates how the event loop works. It will run the code block
 * to completion before the asynchronous callbacks will be called, even
 * though setTimeout() is set to 0 seconds.
 */

(function() {

    console.log('this is the start');

    setTimeout(function cb() {
        console.log('this is a msg from call back');
    });

    console.log('this is just a message');

    setTimeout(function cb1() {
        console.log('this is a msg from call back1');
    }, 0);

    console.log('this is the end');

})();

// "this is the start"
// "this is just a message"
// "this is the end"
// note that function return, which is undefined, happens here 
// "this is a msg from call back"
// "this is a msg from call back1"