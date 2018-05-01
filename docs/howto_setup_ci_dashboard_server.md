# How To Setup Continuous Integration Dashboard Server

## On a Windows 10 Machine

### 1. Download and Install Node.js v8.11.1 (latest stable long-term-release as of writing)
from https://nodejs.org/

### 2. Rebuild Node Modules
This is useful when you install a new version of node, and must recompile all your C++ addons with the new binary.

* Open command prompt and change directory to root of this project
* Run command: **npm rebuild**

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