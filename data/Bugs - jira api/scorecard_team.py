# only tested in python 3
from jira import JIRA
import datetime
import dateutil.parser
import logging
import json
import sys

assert sys.version_info >= (3,0)

username = 'elacharite'
password = ''
url = 'https://jira.lcs.local'
j = JIRA(url, basic_auth=(username, password), options={'verify':False})
log_file = 'spam.log'
data_file = 'jira_ytd_defects.json' # not a real json


# config
products = ['***REMOVED***', '"***REMOVED***"', '***REMOVED***', '***REMOVED***']
maxRes = 1000 # TODO test that this does not affect the results


# Logging 
# create logger with 'spam_application'
logger = logging.getLogger('spam_application')
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler(log_file)
fh.setLevel(logging.DEBUG)
# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.ERROR)
# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)
# add the handlers to the logger
logger.addHandler(fh)
logger.addHandler(ch)

logger.debug("new logger created")


def main():
    now = datetime.date.today()
    # now = dateutil.parser.parse('2018-04-01')

    #YTD
    begin = datetime.datetime.strptime('2017-09-01', "%Y-%m-%d").date()
    end = begin
    # end = datetime.datetime.strptime('{Y}-{m}-01'.format(Y=now.year, m=now.month), "%Y-%m-%d").date()
    while (end < now): # this took 21 minutes to run
        end += datetime.timedelta(days=1)
        print(begin, end)
        getBugAnalytics(begin, end)



def getBugAnalytics(begin, end):
    days = (end-begin).days
    logger.debug("Period {} to {} ({} days)".format(begin, end, days))
    
    results = dict()
    results["period_begin"] = begin.strftime("%Y-%m-%d")
    results["period_end"] = end.strftime("%Y-%m-%d")

    #Resolution time
    for priority in ['Critical', 'Major']:
        qry = 'project in (***REMOVED***, IC, "***REMOVED***", DEV) AND issuetype = Bug AND status in (Resolved, Closed) AND priority in ({priority}) AND resolved >= {begin} AND resolved < {end}'.format(priority=priority, begin=begin, end=end)

        countRes = 0
        totRes = 0
        for issue in j.search_issues(qry, maxResults=maxRes):
            created = dateutil.parser.parse(issue.fields.created)
            resolved = dateutil.parser.parse(issue.fields.resolutiondate)
            totRes += (resolved-created).total_seconds()/86400.
            countRes += 1

        if countRes >= maxRes: raise Exception

        avg_days_to_resolve = totRes/countRes if countRes !=0 else -1

        logger.debug('YTD {} resolution time: {} days (averaged over {} bugs)'.format(priority, avg_days_to_resolve, countRes))
        
        results[priority+'_bugs_completed_total'] = countRes
        results[priority+'_bugs_avg_days_to_resolve'] = avg_days_to_resolve
        

    #Created - resolved
    qry = 'project in (***REMOVED***, IC, "***REMOVED***", DEV) AND issuetype = Bug AND created >= {start_date} AND created < {end_date}'.format(start_date=begin, end_date=end)
    ytd_total_created = len(j.search_issues(qry, maxResults=maxRes))
    if ytd_total_created >= maxRes: raise Exception

    qry = 'project  in (***REMOVED***, IC, "***REMOVED***", DEV) AND issuetype = Bug AND status in (Resolved, Closed) AND resolved >= {start_date} AND resolved < {end_date}'.format(start_date=begin, end_date=end)
    ytd_total_resolved = len(j.search_issues(qry, maxResults=maxRes))
    if ytd_total_resolved >= maxRes: raise Exception

    net_change = ytd_total_created - ytd_total_resolved
    creation_rate_per_day = float(ytd_total_created)/days
    resolution_rate_per_day = float(ytd_total_resolved)/days
    logger.debug ('YTD issues resolved: {}'.format(ytd_total_resolved))
    logger.debug ('YTD issues created: {}'.format(ytd_total_created))
    logger.debug ('YTD issues created-resolved (negative is good): {}'.format(net_change))
    logger.debug ('YTD issues created/day: {}'.format(creation_rate_per_day))
    logger.debug ('YTD issues resolved/day: {}'.format(resolution_rate_per_day))

    
    results["ytd_total_resolved"] = ytd_total_resolved
    results["ytd_total_created"] = ytd_total_created
    results["net_change"] = net_change
    results["creation_rate_per_day"] = creation_rate_per_day
    results["resolution_rate_per_day"] = resolution_rate_per_day


    logger.info(results)

    with open(data_file, 'a') as f:
        f.write(json.dumps(results)+'\n')




if __name__ == '__main__':
    main()