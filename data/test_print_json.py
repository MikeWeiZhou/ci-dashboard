import sys
import json

obj1 = {}
obj1["MINUTES_TOTAL_QUEUE_AND_BUILD"] = "32"
obj1["BUILD_COMPLETED_DATE"] = "2018-04-25 11:47:09"
obj1["BUILD_KEY"] = "S2018BLATLIN-DX6445"

obj2 = {}
obj2["MINUTES_TOTAL_QUEUE_AND_BUILD"] = "103"
obj2["BUILD_COMPLETED_DATE"] = "2018-04-25 11:10:14"
obj2["BUILD_KEY"] = "S2018BLATMAC-ICX6423"

array1 = []
array1.append(obj1)

array2 = []
array2.append(obj2)

# an array of json(s) at a time
print json.dumps(array1)
print json.dumps(array2)
