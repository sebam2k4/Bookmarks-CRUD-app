from flask import Flask
from bs4 import BeautifulSoup
from urllib2 import urlopen

app = Flask(__name__)




# List of url to be scraped for data
# Use local csv file for full list
MY_URLS = ["https://www.codeinstitute.net/",
                "http://www.sebastiankulig.com",
                "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
                "https://gmail.com",]

# Find webpage title and description and store in a dictionary
data_array = []
for my_url in MY_URLS:
    data = {}
    html_text = urlopen(my_url).read()
    soup = BeautifulSoup(html_text, "lxml")

    # get title and description from each url
    # Only need to search through <head>. Any way to narrow the parse of each page to that?
    site_title = soup.title.string
    site_description = soup.html.head.find("meta", attrs={"name":"description"})
    # need to create new dicionary for each new item/iteration to be able to append to list later
    data = {
        'url': my_url,
        'description': site_description['content'] if site_description else "No description given",
        'title': site_title if site_title else "No title given"
    }
    # append screped data to a list
    data_array.append(data)

# Flask routes:
@app. route('/')
def hello():
    return "Hello World!"

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/data')
def data():
    return data_array[0]['description']

if __name__ == '__main__':
    app.run(debug='true')