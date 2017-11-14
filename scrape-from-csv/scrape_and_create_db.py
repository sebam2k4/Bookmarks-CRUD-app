import csv
from urllib2 import urlopen
from bs4 import BeautifulSoup
import pymongo
import sys

'''
Creates initial MongoDb database with collection name
scrape for data, connecto to MongoDB, create db, create, collection, and
insert to collection.
'''

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'test'
COLLECTION_NAME = 'test_collection'
CSV_FILE_NAME = 'urls.csv'

# open csv file and return the row
def readCsvFile(filename):
    try:
        with open(filename) as csvDataFile:
            csvReader = csv.reader(csvDataFile)
            for row in csvReader:
                return row
    except IOError as e:
        print 'Error reading file: %s found' % e
        print 'exiting program...'
        sys.exit()

#Connect to MongoDB
def mongo_connect():
    try:
        conn = pymongo.MongoClient(MONGODB_HOST, MONGODB_PORT)
        print "Mongo is connected!"
        return conn
    except pymongo.errors.ConnectionFailure as e:
        print "Could not connect to MongoDB: %s" % e

# Parse html of webpage and find title and description and store in a dictionary
def get_data(urls):
    data_array = []
    for url in urls:
        html_text = urlopen(url).read()
        soup = BeautifulSoup(html_text, "lxml")
        # get title and description from each url
        # Only need to search through <head>. Any way to narrow the parse of each page to that?
        site_title = soup.title.string
        site_description = soup.html.head.find("meta", attrs={"name":"description"})
        # need to create new dicionary for each new item/iteration to be able to append to list later
        data = {
            'url': url,
            'description': site_description['content'] if site_description else "No description given",
            'title': site_title if site_title else "No title given"
        }
        # append screped data to a list
        data_array.append(data)
    return data_array

my_urls = readCsvFile(CSV_FILE_NAME)

scraped_data = get_data(my_urls)

# Insert data to MongoDB
conn = mongo_connect() #connect to MongoDB
db = conn[DBS_NAME] # db name
coll = db[COLLECTION_NAME] # db collectinon name
coll.drop()  # remove the collection to avoid duplicates when testing
coll.insert(scraped_data) # insert scraped data to db