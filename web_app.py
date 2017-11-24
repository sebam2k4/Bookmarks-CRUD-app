from flask import Flask, render_template, request, json, jsonify
from bs4 import BeautifulSoup
from urllib2 import urlopen
import pymongo
from settings import MONGODB_HOST, MONGODB_PORT, DBS_NAME, COLLECTION_NAME

app = Flask(__name__)

def mongo_connect():
    '''
    connect to MongoDb
    '''
    errors = []
    try:
        connection = pymongo.MongoClient(MONGODB_HOST, MONGODB_PORT)
        print "Mongo is connected!"
        return connection
    except:
        error = "Could not connect to MongoDB"
        print error
        errors.append(error)
        return {'error': errors}

def add_db_document(url):
    '''
    Add a document to MongoDB
    '''
    errors = []
    try:
        # try to read the url input from view
        html_text = urlopen(url).read()
    except:
        # return error if can't read the url
        error = "Unable to get URL. Make sure it's valid and try again."
        print error
        errors.append(error)
        return {'error': errors}

    # after successful url read, scrape urls for data with Beautiful Soup:
    if html_text:
        # use lxml for the soup
        soup = BeautifulSoup(html_text, "lxml")
        # scrape the title of the webpage
        site_title = soup.title.string
        # scrape the meta tags for attribute name="desscription" and get the description text
        site_description = soup.html.head.find("meta", attrs={"name":"description"})
        # store the scraped text and the input url in a dict. if none found, indicate that with a default string
        # need to create new dicionary for each new item/iteration to be able to append to list later
        data = {
            'url': url,
            'description': site_description['content'] if site_description else "No description found",
            'title': site_title if site_title else "No title found"
        }
        
        # add the scraped data to MongoDB
        try:
            connection = mongo_connect() #connect to MongoDB
            db = connection[DBS_NAME] # db name
            collection = db[COLLECTION_NAME] # db collectinon name
            # add document to db collection if it doesn't already exist
            if collection.find_one({"url": url}) < 0:
                collection.save(data) # insert scraped data to db
                success = "Card added to database Successfully!"
                print success
                return {'success': success}
            else:
                # if document already exists, return error message
                error = "Card already exists in database!"
                print error
                errors.append(error)
                return {'error': errors}
        except:
            error = "Unable to add card to database due to unrecognized error."
            print error
            errors.append(error)
            return {'error': errors}

def update_db_document(url, title, description):
    '''
    Update a document in MongoDB
    '''
    errors = []
    # update data to database
    try:
        connection = mongo_connect() #connect to MongoDB
        db = connection[DBS_NAME] # db name
        collection = db[COLLECTION_NAME] # collectinon name
        # update db document with new title and description for which 'url' equals given url
        collection.update_one({"url":{"$eq": url}}, {'$set':{'title': title, 'description': description}})
        success = "Card Updated Successfully!"
        print success
        return {'success': success}

    except:
        error = "Unable to update card due to unrecognized error."
        print error
        errors.append(error)
        return {'error': errors}


def remove_db_document(url):
    '''
    Remove a document from MongoDB
    '''
    errors = []
    try:
        connection = mongo_connect() #connect to MongoDB
        db = connection[DBS_NAME] # db name
        collection = db[COLLECTION_NAME] # collectinon name
        # delete db document for which 'url' equals given url from view
        collection.delete_one({"url": { "$eq": url }})
        success = "Removed Successfully!"
        print success
        return {'success': success}

    except:
        error = "Unable to remove card from database due to unrecognized error."
        print error
        errors.append(error)
        return {'error': errors}


# Flask routes:
@app.route('/',)
def index():
    """
    A Flask view to render the index.html
    """
    return render_template('index.html')

@app.route('/add_card', methods=['POST'])
def add_card():
    """
    A Flask view to handle adding a document to MongoDB.
    """
    results = []
    # get form input data from view's jquery ajax request
    input_url = request.form.get('add-card')
    print "input: %s" % input_url
    # try to add the doc to db and populate the results list with any success or error messsges.
    results = add_db_document(input_url)
    return jsonify(results=results)

@app.route('/update_card', methods=['PUT'])
def update_card():
    """
    A Flask view to handle updating existing document in MongoDB.
    """
    results = []
    # get json data from view's jquery ajax request
    input_url = request.json['url']
    title = request.json['title']
    description = request.json['description']
    print input_url
    print title
    print description
    # try to update the db and populate the results list with any success or error messsges.
    results = update_db_document(input_url, title, description)
    return jsonify(results=results)

@app.route('/remove_card', methods=['DELETE'])
def remove_card():
    """
    A Flask view to handle removal of a document from MongoDB.
    """
    results = []
    # get json data from view's jquery ajax request
    input_url = request.json
    print input_url
    # try to remove the doc from db and populate the results list with any success or error messsges.
    results = remove_db_document(input_url)
    # return any success or error messages to display in view
    return jsonify(results=results)

@app.route("/webpage_data", methods=['GET'])
def webpage_data():
    """
    A Flask view to serve project data from MongoDB in JSON format.
    """
    # A constant that defines the record fields that we wish to retrieve
    FIELDS = {
        '_id': False, 'url': True, 'title': True,
        'description': True
    }

    # Open a connection to MongoDB using a 'with' statement such that the
    # connection will be closed as soon as we exit the 'with' statement
    with pymongo.MongoClient(MONGODB_HOST, MONGODB_PORT) as connection:
        # Define which collection we wish to access
        collection = connection[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the output results to 250
        webpage_data = collection.find(projection=FIELDS, limit=35)
        # serialize/convert Python list to JSON and return the JSON data
        return json.dumps(list(webpage_data))
        


if __name__ == '__main__':
    app.run(debug='true')