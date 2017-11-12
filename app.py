from flask import Flask
from bs4 import BeautifulSoup
from urllib2 import urlopen
import pymongo

app = Flask(__name__)

# scrape for data, connecto to MongoDB, create db, create, collection, and
# instert to collection. Need to seperat this and create update db function.
def create_db_and_scrape_webpages():
    #Connect to MongoDB
    def mongo_connect():
        try:
            conn = pymongo.MongoClient()
            print "Mongo is connected!"
            return conn
        except pymongo.errors.ConnectionFailure, e:
            print "Could not connect to MongoDB: %s" % e


    # List of url to be scraped for data
    # Use local csv file for full list
    MY_URLS = ["https://www.codeinstitute.net/",
                    "http://www.sebastiankulig.com",
                    "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
                    "https://gmail.com",
                    "https://square.github.io/intro-to-d3/"]

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

    scraped_data = get_data(MY_URLS)
    conn = mongo_connect() #connect to MongoDB
    db = conn['webpage-data'] # db name
    coll = db.webpage_data # db collectinon name
    coll.drop()  # remove the collection to avoid duplicates when testing
    coll.insert(scraped_data) # insert scraped data to db

# Flask routes:
@app. route('/')
def hello():
    return "Hello World!"

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

if __name__ == '__main__':
    app.run(debug='true')