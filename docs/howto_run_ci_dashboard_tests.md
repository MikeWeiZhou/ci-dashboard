# How To Run Continuous Integration Dashboard Tests

## 1. Install CI Dashboard Server and Setup Development Environment
Ensure you have followed the documentation **How To Setup Continuous Integration Dashboard Server** as well as **How To Setup Development Environment** and successfully installed Node.js and Node Package Manager (NPM) along with rebuilding the required node modules.

## 2. Run Tests

* Open command prompt and change directory to root of this project
* Run command: **npm test**

This will run the test command specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "test": "mocha"
},
```

Which will run the Mocha test framework which by default calls the test script in **test/tests.js**.

# About the Mocha Test Framework

Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on GitHub.

* https://mochajs.org/
