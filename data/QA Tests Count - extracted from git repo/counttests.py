#! python3

import glob
import os
import sys
from os.path import expanduser, isdir


def main():
    if not len(sys.argv) > 1:
        print("Error, this script takes the QA repo path as an argument")
        return -1
        
    qa_repo_dir = sys.argv[1]
    total_test_count = counttests(qa_repo_dir)
    print("acceptance test count: {}".format(total_test_count))



def counttests(qa_repo_path):
    qa_repo_path = expanduser(qa_repo_path)
    assert isdir(qa_repo_path)
    data = {
        "***REMOVED***": {
            "pattern": ("test_application*.lsf", "*_test.lsf"),
            "count" : 0,
        },

        "***REMOVED***": {
            "pattern": ("test_application*.py", "*_test.py"),
            "count" : 0,
        },

        "***REMOVED***": {
            "pattern": ("*_test.lsf", "application_*.lsf"),
            "count" : 0,
        },

        "***REMOVED***": {
            "pattern": ("*_testsuite.lsf",),
            "count" : 0,
        },

        "***REMOVED***": {
            "pattern": ("*_test.lsf",),
            "count" : 0,
        },

        "INTEROP/aws": {
            "pattern": ("*_test.lsf",),
            "count": 0,
        },

        "INTEROP/lumerical-api": {
            "pattern": ("*_test.lsf",),
            "count": 0,
        },

        "INTEROP/matlab": {
            "pattern": ("Test*.m", "*_test.lsf"),
            "count": 0,
        },

        "INTEROP/python-api": {
            "pattern": ("*_test.py",),
            "count": 0,
        },
    }

    for relativePath in data.keys():
        for p in data[relativePath]["pattern"]:
            fullPattern = qa_repo_path+"/"+relativePath+"/**/"+p
            data[relativePath]["count"] += len(glob.glob(fullPattern, recursive=True))

    total_test_count = sum([v["count"] for v in data.values()])
    return total_test_count



    
if __name__ == '__main__':
    main()

