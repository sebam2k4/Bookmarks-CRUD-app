from flask import Flask, render_template, request
from bs4 import BeautifulSoup
from urllib2 import urlopen
from pymongo import MongoClient

app = Flask(__name__)

# Flask routes:
@app. route('/', methods=['GET', 'POST'])
def index():
    errors = []
    results = []
    print request.method
    if request.method == "POST":
        # get url that the user has entered
        try:
            url = request.form['url']
            html_text = urlopen(url).read()
        except:
            errors.append("Unable to get URL. Make sure it's valid and try again.")
            return render_template('index.html', errors = errors)
        # after successful url read:
        if html_text:
            soup = BeautifulSoup(html_text, "lxml")
            site_title = soup.title.string
            site_description = soup.html.head.find("meta", attrs={"name":"description"})
            # need to create new dicionary for each new item/iteration to be able to append to list later
            data = {
                'url': url,
                'description': site_description['content'] if site_description else "No description given",
                'title': site_title if site_title else "No title given"
            }
            # append scraped data to results list
            # Don't really need when scraping only one url at a time
            results.append(data)
            print results[0]['title']


            try:
                connection = MongoClient('localhost', 27017) #connect to MongoDB
                db = connection['client-database'] # db name
                collection = db.webpage_data # db collectinon name
                collection.insert(results) # insert scraped data to db
                print results
            except:
                print "Unable to connect to database."
                errors.append("Unable to connect to database.")
                return render_template('index.html', errors = errors)
    return render_template('index.html', errors=errors, results=results)

if __name__ == '__main__':
    app.run(debug='true')