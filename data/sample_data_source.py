import sys
import json

# Generate and print a stream of json arrays (to stdout)
def print_sample_data(iterations):
    for x in range(iterations):

        json_object = {}
        json_object["iteration_num"] = x
        json_object["not_relevant"] = "nn"

        # must append to json array
        # can have more than one json objects inside one json array
        json_array = []
        json_array.append(json_object)

        # the server will receive this as a stream of json arrays
        print(json.dumps(json_array))



# first and second input from server (through stdin)
# date format is defined in config file: config.dateformat.python
fromdate = sys.stdin.readline().strip()
todate = sys.stdin.readline().strip()

# first run, print data for 10000 iterations
# 2017-01-01 is the default from date inside the tracker table
if fromdate == "2017-01-01":
    print_sample_data(10000)

# second run, different types of crashes
# uncomment only one per run
else:
    # print("invalid json object")
    # print(1/0)
    sys.exit(10)