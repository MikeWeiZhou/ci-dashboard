# How To Add KPI Chart

## 1. Create KPI Mapper

Create a new class extending from the base classes (e.g. KpiMapper, AverageLineKpiMapper). Samples are provided within the kpimappers folder.

## 2. Use config/kpigoals.js for target and stretch goals

So it's easier to change goals in the future.

## 3. Rebuild the back-end

* npm run build-back
* npm run start