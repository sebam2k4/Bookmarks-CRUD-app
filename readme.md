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
Flask
Urllib
Pymongo
jQuery 3.2.1
Bootstrap 3.3.7
Beautiful Soup 4

### ToDo:
- look into jquery ajax error handling
- see if flask/python error handling can be improved
- Read more about HTTP responses: GET, POST, PUT, DELETE
- Add user accounts (login/registration) and feature a working example with no data persistance.
- Use firebase for user accounts and bookmark storage

### Features to Add:
- tags and filtering - for starters could just do text input field search
- set a limit to amount of documents that can be stored in db
- Find a way to prevent or minimize inappropriate urls from being stored in db and displayed in front-end

### Bugs:
- When addings a card, some urls do not work returning 'invalid url' error. This may be due to text encoding. Needs further investigation

### used help from these pages:

https://stackoverflow.com/questions/10434599/how-to-get-data-received-in-flask-request
https://stackoverflow.com/questions/19794695/flask-python-buttons