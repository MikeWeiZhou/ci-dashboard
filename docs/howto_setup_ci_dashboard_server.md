# How To Setup Continuous Integration Dashboard Server

## On a Windows 10 Server

### 1. Download and Install Node.js v8.11.1 (latest stable long-term-release as of writing)
from https://nodejs.org/

### 2. Install Required Node Modules
**THIS STEP SHOULD NOT BE NECESSARY AS ALL REQUIRED NODE MODULES SHOULD BE ALREADY INSTALLED INTO THE node_modules DIRECTORY**. However, you may need to run this step if you are initializing the node project from scratch or attempting to run on an operating system other than Windows 10.

* 1. Open command prompt and change directory to root of this project
* 2. Run command: **npm install <node module>**

**List of required node modules:**
* mocha (unit testing framework)