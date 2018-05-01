# How To Setup Development Environment

## 1. Install CI Dashboard Server
Ensure you have followed the documentation **How To Setup Continuous Integration Dashboard Server** and successfully installed Node.js and Node Package Manager (NPM) along with the required node modules.

## 2. Install Required Development Node Modules (Only when things go wrong)
**This step should not be necessary as all required node modules should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project was solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install <node module>**

#### List of required development node modules:

* **typescript** (gives javascript typing and more)
* **ts-node** (allows running node server on typescripts instead of compiling on each change)
* **mocha** (unit testing framework)

## 3. Install Required Development Node Module Types (Only when things go wrong)
These are type definitions for typescript to work correctly. **This step should not be necessary as all required node module types should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project was solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install @types/<node module>**

#### List of required local development node module types:

* **express** (web framework/routing)

## 4. Compile into JavaScript and Run Server
This will compile the typescript into javascript and run the webserver.js in the *dist* directory.

* Open command prompt and change directory to root of this project
* To compile TypeScript into JavaScript, run command: **npm run compile**
* To compile then run server, run command: **npm run cnr** (compile-n-run)
* To run server, run command: **npm start**

npm run **cnr** and **compile** command is specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "compile": "tsc -p lib --outDir dist",
    "cnr": "npm run compile && npm start"
},
```