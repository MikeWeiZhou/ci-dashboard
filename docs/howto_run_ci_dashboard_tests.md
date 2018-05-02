# How To Run Continuous Integration Dashboard Tests

## 1. Install CI Dashboard Server and Setup Development Environment
Ensure you have followed the documentation **How To Setup Continuous Integration Dashboard Server** as well as **How To Setup Development Environment** and successfully installed Node.js and Node Package Manager (NPM) along with installing the required node modules.

## 2. Modifying and Running Tests

This will compile the TypeScript (in *source/unittests* directory) into JavaScript (to *compiled/unittests* directory) and runs the tests.js in the *compiled/unittests* directory.

* Open command prompt and change directory to root of this project
* To compile TypeScript into JavaScript, run command: **npm run compiletests**
* To compile and then run server, run command: **npm run cnrt** (compile-n-run tests)
* To run tests, run command: **npm test**

npm run **compiletests** and **cnrt** command is specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "test": "mocha compiled/unittests/tests.js",
    "compiletests": "tsc -p source/unittests --outDir compiled/unittests",
    "cnrt": "npm run compiletests && npm test"
},
```

# About the Mocha Test Framework

Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on GitHub.

* https://mochajs.org/
