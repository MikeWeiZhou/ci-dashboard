# How To Setup Continuous Integration Dashboard Server

## On a Windows 10 Server

### 1. Download and Install Node.js v8.11.1 (latest stable long-term-release as of writing)
from https://nodejs.org/

### 2. Install Required Node Modules (Only when things go wrong)
**This step should not be necessary as all required node modules should already be installed into the node_modules directory.** However, you may need to run this step if you are initializing the node project from scratch or attempting to run/develop on an operating system other than Windows 10, as this project is solely developed on Windows 10.

* Open command prompt and change directory to root of this project
* Run command: **npm install <node module>**

#### List of required node modules:

* **mocha** (unit testing framework)