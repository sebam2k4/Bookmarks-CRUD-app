from flask import Flask, render_template, request
from bs4 import BeautifulSoup
from urllib2 import urlopen
import pymongo

app = Flask(__name__)

# Flask routes:
@app. route('/', methods=['GET', 'POST'])
def index():
    errors = []
    results = []
    if request.method == "POST":
        # get url that the user has entered
        try:
            url = request.form['url']
            html_text = urlopen(url).read()
        except:
            error = "Unable to get URL. Make sure it's valid and try again."
            print error
            errors.append(error)
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
            results.append(data)
            #print data['url']
            #print results[0]['title']

            def mongo_connect():
                try:
                    connection = pymongo.MongoClient('localhost', 27017)
                    print "Mongo is connected!"
                    return connection
                except pymongo.errors.ConnectionFailure, e:
                    error = "Could not connect to MongoDB: %s" % e
                    print error
                    errors.append(error)
                    return render_template('index.html', errors = errors)
            
            # insert data to database
            try:
                connection = mongo_connect() #connect to MongoDB
                db = connection['client-database'] # db name
                collection = db.webpage_data # db collectinon name
                # add record to collection if it doesn't already exist
                if collection.find_one({"url": url}) < 0:
                    collection.save(data) # insert scraped data to db
                    success = "Record Successfully Added!"
                    return render_template('index.html', success=success)
                else:
                    error = "Record already exists in database!"
                    print error
                    errors.append(error)
                    return render_template('index.html', errors = errors)
            except:
                error = "Unable to add record to database due to unrecognized error."
                print error
                errors.append(error)
                return render_template('index.html', errors = errors)
    return render_template('index.html', errors=errors, results=results, success = success)

if __name__ == '__main__':
    app.run(debug='true')