# KPI Dashboard

BCIT ISSP 2018 spring project - ***REMOVED*** CI Dashboard


## 1. Operational areas
These areas are just a working prototype.

* Data visualization demo
* Pipeline from data collection (raw JSON file) -> data interface -> data storage


## 2. How to setup and run latest development version of CI Dashboard

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*
* Open command line/bash and change directory to root of project

### Test Data visualization

* Run command: *npm run start*
* The default browser should automatically start and load the web app.

### Test Pipeline from data collection (raw JSON file) -> data interface -> data storage

* Run command: *npm run testpipeline*
* ^ runs the compiled version of the file *source/test_pipeline_json_to_db.ts*


## 3. Directory Structure

### compiled
Javascript compiled from Typescript. Includes unit tests.

### source
Typescript source. Includes unit tests.

### data
Sample data files.

### config
Configuration files.

### docs
Holds all the documentation and how-to's.

### logs
Server logs organized by date and time.

### plotly-demo
Plotly.js experimentation. Front-end library.

### react-demo
React experimentation. Front-end view server.

### codesnippets
Code snippets/experiments. This is purely for developers.