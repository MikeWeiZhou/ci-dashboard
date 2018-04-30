/**
 * Demonstrates the blocking of the event-loop.
 * 
 * We do a setTimeout() to run after 500ms, however, it does not run till
 * the infinite loop exits, due to the single threaded nature of JavaScript.
 * 
 * The infinite loop exits only after 2 seconds, and each "message"/code block
 * will run till completion (no premtion), so the setTimeout can only run
 * after infinite loop returns.
 */

const s = new Date().getSeconds();

setTimeout(function() {
    // prints out "2", meaning that the callback is not called immediately after 500 milliseconds.
    console.log("Ran after " + (new Date().getSeconds() - s) + " seconds");
}, 500);

while(true) {
    if(new Date().getSeconds() - s >= 2) {
        console.log("Good, looped for 2 seconds");
        break;
    }
}