# KPI Dashboard

BCIT ISSP 2018 spring project - ***REMOVED*** CI Dashboard


## 1. Demo-able areas
These areas are just a working prototype. Run command **npm run setup** again, as it will help setup required database tables.

* Data visualization demo
* Data collector scheduler
* Unit tests


## 2. How to setup and run latest development version of CI Dashboard

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*
* Open command line/bash and change directory to root of project

### Data visualization demo

* Run command: *npm run start*
* The default browser should automatically start and load the web app.

### Data collector scheduler

* Run command: *npm run server*
* ^ runs the compiled version of the file *source/startserver.ts*
* ^ all schedules in compiled version of *source/startscheduler.ts* will start running

### Unit tests

* Run command: *npm run test*
* ^ runs the unit test suite and pipeline-out


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