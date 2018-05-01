# How To Setup Continuous Integration Dashboard Server

## On a Windows 10 Machine

### 1. Download and Install Node.js v8.11.1 (latest stable long-term-release as of writing)
from https://nodejs.org/

### 2. Install Required Server Node Modules (Only when things go wrong)
**This step should not be necessary as all required node modules should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project was solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install <node module>**

#### List of required server node modules:

* **express** (web framework/routing)
* **body-parser** (middleware for getting POST data)

### 3. Run CI Dashboard Server

* Open command prompt and change directory to root of this project
* Run command: **npm start**

This will run the start command specified in the **package.json** file in root directory. It should have these lines in it:

```
"scripts": {
    "start": "node dist/webserver.js"
},
```

Which will run the script **dist/webserver.js** in Node.js.