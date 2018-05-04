from os.path import expanduser, isdir
from countunittests import countunittests
from counttests import counttests
from subprocess import call, check_output
import sys
from os import chdir
import datetime
import json



qa_repo_path = expanduser("~/Repositories/lumerical-QA")

# TODO this file gets output in the repo dir do to chdir
data_file = 'qa_test_count.json' # not a real json



# checks out last commit on a given day (will checkout previous days if none exist) 
# returns commit id that was checked out
def checkout_date(date):
    command = '''git rev-list -n 1 --before='{Y}-{m}-{d} 23:59' master'''.format(Y=date.year, m=date.month, d=date.day) #'''git checkout ``'''
    rev = check_output(command, shell=True).decode("utf-8").strip() # b'****\n'
    command = "git checkout {}".format(rev)
    call(command, shell=True)
    return rev



if __name__ == '__main__':
    assert isdir(qa_repo_path)

    chdir(qa_repo_path)

    now = datetime.date.today()
    
    #YTD
    data_date = datetime.datetime.strptime('2017-09-01', "%Y-%m-%d").date()
  
    rev_old = ''
    while (data_date < now): 
        rev = checkout_date(data_date)
        if rev != rev_old: # skip duplicate commits
            total_unit_tests = countunittests(qa_repo_path)
            total_application_tests = counttests(qa_repo_path)
            print(data_date, total_unit_tests, total_application_tests)
            results = dict()
            results['date'] = data_date.strftime("%Y-%m-%d")
            results['total_unit_tests'] = total_unit_tests
            results['total_application_tests'] = total_application_tests
            with open(data_file, 'a') as f:
                f.write(json.dumps(results)+'\n')
            
            rev_old = rev
            

        data_date += datetime.timedelta(days=1)
    

