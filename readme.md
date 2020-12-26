**Note: heroku mongoDB addon has been disabled/detached - need to find a new addon or change db**

## Bookmark CRUD App

This is a bookmarking app for storing useful urls in a card format with the webpage's title and description. The user has the ability to open the link in a new tab. Also, any card can have its title and description edited, and the card can be removed from the list.

The app uses async HTTP requests to communicate with the server for adding, removing, and saving of cards as well as scraping the webpage's information for its title and description and then saving the information in a database.

Initial data was obtained and stored using my python webpage scraper available [here](https://github.com/sebam2k4/webpage-scraper) it takes a csv file with urls and scrapes each for title and description. It then saves the results in a MongoDB collection. It was then exported to JSON from the local dev environment and imported to live production demo's MongoDB.

### Features:

- Add Card
  - Gets the input url's title and description from the server and creates a new card
- Edit Card
  - Hides buttons for other cards and save button appears for edited card.
- Cancel Edit Card
  - Reverts card title and description text to original
- Save Edited Card
- Delete Card

### Tech Used:
Python 2.7
Flask
Urllib
Pymongo
jQuery 3.2.1
Bootstrap 3.3.7
Beautiful Soup 4

## Setting the project up on your local machine
1. download or clone the repository.
2. create a virtual envitornment using `virtualenv` in the project's root folder.
3. activate your virtual environment.
4. run `pip install -r requirements.txt` from your command line to install all package dependencies.
5. Make sure you have MongoDB installed and are running an instance of `mongod` locally using port 27017 (see settings.py)
6. run `python web_app.py` from your command line to run the project on a local server.
7. Navigate to http://127.0.0.1:5000 in your browser to view the project.

### ToDo:
- look into jquery ajax error handling
- see if flask/python error handling can be improved
- Read more about HTTP responses: GET, POST, PUT, DELETE
- Add user accounts (login/registration) and feature a working example with no data persistance.
- Use firebase for user accounts and bookmark storage
- remove unnecessary http requests to reload data on 'card delete'
- Add flash error message when not connected to MongoDB

### Features to Add:
- tags and filtering - for starters could just do text input field search
- set a limit to amount of documents that can be stored in db
- Find a way to prevent or minimize inappropriate urls from being stored in db and displayed in front-end

### Bugs:
- When addings a card, some urls do not work returning 'invalid url' error. This may be due to text encoding. Needs further investigation

### used help from these pages:

https://stackoverflow.com/questions/10434599/how-to-get-data-received-in-flask-request
https://stackoverflow.com/questions/19794695/flask-python-buttons
