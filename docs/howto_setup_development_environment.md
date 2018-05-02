# How To Setup Development Environment

## 1. Install CI Dashboard Server
Ensure you have followed the documentation **How To Setup Continuous Integration Dashboard Server** and successfully installed Node.js and Node Package Manager (NPM) along with installing the required node modules.

## 2. Compile into JavaScript and Run Server
This will compile the TypeScript (in *source* directory) into JavaScript (to *compiled* directory) and runs the server.js in the *compiled* directory.

* Open command prompt and change directory to root of this project
* To compile TypeScript into JavaScript, run command: **npm run compile**
* To compile and then run server, run command: **npm run cnr** (compile-n-run)
* To run server, run command: **npm start**

npm run **cnr** and **compile** command is specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "compile": "tsc -p source --outDir compiled",
    "cnr": "npm run compile && npm start"
},
```