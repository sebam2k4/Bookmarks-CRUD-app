/*queue()
.defer("/data")
.await(showRecords);


// if error occurs here then most likely due to
// server or database problem
function showRecords(error, client_dtabase) {
    if (error) {
        console.error("showRecords rrror on receiving dataset:", error.statusText);
        throw error;
    }
*/

// document.getElementById('showRecords').addEventListener('click', loadData);

// use click events on button instead of button type="submit" to avoid page reload
// Will need a GET to load the initial data on document ready.
// Then will probably need two requests for buttons. POST - to modify json and db & GET to reload the data ?
function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'webpage_data', true);
    
    xhr.onload = function() {
    if(this.status == 200) {
        var data = JSON.parse(this.response);  //need to parse to object
        var reversed_data = data.reverse();
        var output = '';

        for (var i in reversed_data) {
        output += '<div class="row">' +
                        '<div class="card-container col-xs-10 col-sm-11">' +
                            '<a class="card" target="_blank" href="' + reversed_data[i].url + '">' +
                                '<div class="panel panel-primary">' +
                                    '<div class="panel-heading">' +
                                        '<h4>' + reversed_data[i].title + '</h4>' +
                                    '</div>' +
                                    '<div class="panel-body">' +
                                        '<p>' + reversed_data[i].description + '</p>' +
                                        '<p>url: ' + reversed_data[i].url + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</a>' +
                        '</div>' +
                        '<div class="card-buttons col-xs-2 col-sm-1">' +
                            '<form role="form" method="POST" action="/">' +
                                '<button type="submit" name="remove-card" class="btn btn-default" id="removeCard" aria-label="Left Align" title="remove" value="' + data[i].url + '">' +
                                    '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                                '</button>' +
                            '</form>' +
                            '<button type="button" class="btn btn-default" id="editCard" aria-label="Left Align" title="edit">' +
                                '<span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                            '</button>' +
                        '</div>' +
                    '</div>';

        }
        document.getElementById('output').innerHTML = output;
    } else if(this.status == 404) {
        console.log("Data not found (404)");
        document.getElementById('output').innerHTML = "Data not found (404)";
    } else if(this.status == 500) {
        console.log("Internal Server Error (500)");
        document.getElementById('output').innerHTML = "Internal Server Error (500)";
      }
    }

    xhr.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
    loadData()
});
