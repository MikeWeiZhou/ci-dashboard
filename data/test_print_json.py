# Sample python script showing how to:
#   1. receive dates and messages from node server
#   2. send json arrays to node server
#   3. exit script with an exit code detectable on node server
#   4. program crash detectable on node server (e.g. division by zero)

# See source/unittests/datacollectors/unittests.py for more elaborate demonstration
# of the communication between python and node.
#
# the unit test in source/unittests/datacollectors/TestPythonShellJsonDataCollector.ts
# drives the communication.

import sys
import json

obj1 = {}
obj1["BUILDRESULTSUMMARY_ID"] = "109126285"
obj1["MINUTES_TOTAL_QUEUE_AND_BUILD"] = "32"
obj1["BUILD_COMPLETED_DATE"] = "2018-04-25 11:47:09"
obj1["BUILD_KEY"] = "S2018BLATLIN-DX6445"

obj2 = {}
obj2["BUILDRESULTSUMMARY_ID"] = "109126285"
obj2["MINUTES_TOTAL_QUEUE_AND_BUILD"] = "103"
obj2["BUILD_COMPLETED_DATE"] = "2018-04-25 11:10:14"
obj2["BUILD_KEY"] = "S2018BLATMAC-ICX6423"

array1 = []
array1.append(obj1)

array2 = []
array2.append(obj2)

# 1. receive dates from node
# fromdate = sys.stdin.readline().rstrip() # first line sent from node
# todate = sys.stdin.readline().rstrip()   # second line sent from node
# print(todate)                            # date format can be configured in config

# 2. send data to node: json arrays
print(json.dumps(array1))
print(json.dumps(array2))

# 3. exit code can be detected in node
# by default, 0 = successful execution, 1 = program error (e.g. division by zero)
# sys.exit(10)

# 4. errors and details can be detected in node when program crashes
# exit code will be 1
# print(1/0)