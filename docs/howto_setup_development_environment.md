# How To Setup Development Environment

## 1. Install CI Dashboard Server
Ensure you have followed the documentation **How To Setup Continuous Integration Dashboard Server** and successfully installed Node.js and Node Package Manager (NPM) along with the required node modules.

## 2. Install Required Development Node Modules Globally
Installing node modules globally will install onto the operating system user's profile and allows command line direct access the module binaries.

* Open command prompt
* Run command: **npm install -g <node module>**

#### List of required global development node modules:

* **typescript** (gives javascript typing and more)
* **ts-node** (allows running node server on typescripts instead of compiling on each change)

## 3. Install Required Development Node Modules Locally (Only when things go wrong)
**This step should not be necessary as all required local node modules should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project was solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install <node module>**

#### List of required local development node modules:

* **mocha** (unit testing framework)

## 4. Install Required Development Node Module Types Locally (Only when things go wrong)
These are type definitions for typescript to work correctly. **This step should not be necessary as all required local node module types should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project was solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install @types/<node module>**

#### List of required local development node module types:

* **express** (web framework/routing)