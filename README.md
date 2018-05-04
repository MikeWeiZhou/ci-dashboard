# KPI Dashboard

BCIT ISSP 2018 spring project - ***REMOVED*** CI Dashboard


## Operational areas
These areas are just a working prototype.

* Pipeline from data collection (raw JSON file) -> data interface -> data storage
* Data visualization demo


## How to setup and run latest development version of CI Dashboard

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*
* ^ ignore Step 7. Run Node.js and Step 8. Open the web application

### Test Pipeline from data collection (raw JSON file) -> data interface -> data storage

* Open command line/bash and change directory to root of project
* Run command: *npm run testpipeline*
* ^ runs the compiled version of the file *source/test_pipeline_json_to_db.ts*

### Test Data visualization

* Open command line/bash and change directory to react-demo
* Run command: *npm install* to install all required node modules for react
* Run command: *npm run start*
* The default browser should automatically start and load the web app

## Directory Structure

### compiled
Javascript files. Compiled from Typescript. Includes unit tests.

### source
Typescript source files. Includes unit tests.

### data
Sample data files.

### config
Configuration files.

### docs
Holds all the documentation and how-to's.

### plotly-demo
Plotly.js experimentation. Front-end library.

### react-demo
React experimentation. Front-end view server.

### codesnippets
Code snippets/experiments. This is purely for developers.