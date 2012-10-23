import urllib2
import json

trove_api_key = "lb676h2eqpsrtkrc"
trove_api_url = "http://api.trove.nla.gov.au/result?zone=newspaper"
start = 1803
end = 1954

totals = {}
for year in range(start, end+1):
    url = '%s&q=date:[%s+TO+%s]&n=0&l-category=Article&encoding=json&key=%s' % (trove_api_url, year, year, trove_api_key)
    print url
    response = urllib2.urlopen(url)
    results = json.load(response)
    total = results['response']['zone'][0]['records']['total']
    totals[year] = total
    print '%s: %s' % (year, total)
print json.dumps(totals)
