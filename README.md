# KPI Dashboard

BCIT ISSP 2018 spring project - ***REMOVED*** CI Dashboard


## 1. Latest Prototype (Tuesday May 9th, 2018 2:10 PM)
From an end-user perspective, currently the prototype has the basic client-server architecture setup and is functional.

* The team is working on different ways of visualizing the data **(priority)**
* The pipeline from data source (e.g. python script) to the REST API serving KPI states **is working and in refinement/bug fixing**
* Front-end currently requests data from the backend via API (with customizable date ranges) and generates the KPI graphs dynamically
* Currently we are making front-end data visualization layer more modular so when a new KPI is added in the back-end the UI will automatically update to show the new KPI **work in progress**
* More unit tests are on the way

### Installation

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*
* Open command line/bash and change directory to root of project

### Run CI Dashboard

* Run command: *npm run start*
* Then visit http://localhost for data visualization
* Or visit http://localhost/kpi/qa/overall_builds_success/2001-01-10/2018-09-10 as the example REST API route

### Run Unit Tests

* Run command: *npm run test*
* ^ Builds and runs unit test on the back-end


## 2. NPM Commands
These commands are mainly for easier development and testing. **DB Note**: If database model changes, old tables must be dropped/changed first.

* **npm run setup** installs node dependencies, builds front and back-end, and setup database
* **npm run setup-front** setup front-end only
* **npm run setup-back** setup back-end only, including the database
***
* **npm run build** builds front and back-end
* **npm run build-front** builds front-end only
* **npm run build-back** builds back-end only
***
* **npm run start** runs the built version of dashboard
***
* **npm run dev-back** runs the back-end in dev-mode without needing to build
* **npm run dev-front** runs the front-end in dev-mode without needing to build
***
* **npm run test** builds the back-end and runs unit tests on the back-end


## 3. Directory Structure

### build
Javascript compiled from Typescript. Includes react front-end and unit tests.

### source
Typescript source. Includes unit tests.

### data
Sample data files.

### config
Configuration files.

### docs
Holds all the documentation and how-to's.

### logs
Server error logs organized by date and time.

### plotly-demo
Plotly.js experimentation. Front-end library.

### react-demo
React experimentation. Front-end view server.

### codesnippets
Code snippets/experiments. This is purely for developers.