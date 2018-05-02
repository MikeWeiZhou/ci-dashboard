# How To Setup Continuous Integration Dashboard Server

## 1. Download and Install Node.js v8.11.1 (latest stable long-term-release as of writing)
from https://nodejs.org/

## 2. Install Required Node Modules
This will install all dependencies listed in **package.json** file

* Open command prompt and change directory to root of this project
* Run command: **npm install**

## 3. Run CI Dashboard Server

* Open command prompt and change directory to root of this project
* Run command: **npm start**

This will run the start command specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "start": "node compiled/server.js"
},
```

Which will run the script **compiled/server.js** in Node.js.