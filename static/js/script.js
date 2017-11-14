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

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data', true);
    
    xhr.onload = function() {
    if(this.status == 200) {
        var data = JSON.parse(this.response);  //need to parse to object
        console.log(data)
        var output = '';

        for (var i in data) {
        output += '<ul>' +
        '<li>Title: ' + data[i].title + '</li>' +
        '<li>Description: ' + data[i].description + '</li>' +
        '<li>URL: ' + data[i].url + '</li>' +
        '</ul>';
        }
        document.getElementById('output').innerHTML = output;
    } else if(this.status == 404) {
        console.log("Data not found (404)");
        document.getElementById('output').innerHTML = "Data not not found (404)";
      }
    }

    xhr.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
    loadData()
});
