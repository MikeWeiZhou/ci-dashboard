# How To Add KPI Chart

## 1. Create KPI Mapper

Create a new class extending from the base classes (e.g. KpiMapper, AverageLineKpiMapper). Samples are provided within the kpimappers folder.

## 2. Use config/kpigoals.js for target and stretch goals

So it's easier to change goals in the future.

## 3. Add KPI Mapper to react-app/src/BuildDashboard.js

Add the new route to **routes** variable. Format is:

* Folder_Name/KPIName (do not include the suffix KpiMapper)

## 4. Rebuild the front-end and back-end

* Run command: npm run build