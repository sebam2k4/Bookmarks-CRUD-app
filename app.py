from flask import Flask, render_template
from bs4 import BeautifulSoup
from urllib2 import urlopen
import pymongo

app = Flask(__name__)



# Flask routes:
@app. route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug='true')