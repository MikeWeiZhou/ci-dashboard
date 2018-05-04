## python3

import glob
import os
import sys
from os.path import expanduser, isdir

def main():
    if not len(sys.argv) > 1:
        print("Error, this script takes the QA repo path as an argument")
        return -1

    qa_repo_path = sys.argv[1]
    tests = countunittests(qa_repo_path)
    print("unit test count: {}".format(tests))


def countunittests(qa_repo_path):
    qa_repo_path = expanduser(qa_repo_path)
    assert isdir(qa_repo_path)

    os.chdir(qa_repo_path)



    files = glob.iglob("**/*test.cpp", recursive=True)

    count = 0

    for f in files:
        with open(f, "r") as testfile:
            content = testfile.read()

        count += len(list(filter(lambda x:"DISABLED" not in x, content.replace(" ","").replace("\n","").split("TEST("))))-1
        count += len(list(filter(lambda x:"DISABLED" not in x, content.replace(" ","").replace("\n","").split("TEST_F("))))-1

    return count


if __name__ == '__main__':
    main()
