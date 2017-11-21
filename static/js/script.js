$(document).ready(function() {
    
    // ADD CARD
    $('#addUrlForm').on("submit", function(){
        // prevent page reload on form submit (default behaviour)
        event.preventDefault();
        // capture url from user input
        var input_url = $('#inputUrl').val();
        $.ajax({
            url: '/add_card',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response){
                // output server error or success message:
                showMessage(response);
            },
            error: function(error){
                console.log(error);
            }
        })
        // reload data
        .done(function() {
            loadData();
        });
    });

    // REMOVE CARD
    // .on method with delegated event needed for click event to work on future elements
    // Needs to be used on static parent element
    $('#cards').on("click", '#removeCardBtn', function(){S
        // capture value of clicked button (url)
        var input_url = $(this).val();
        console.log(input_url)
        $.ajax({
            url: '/remove_card',
            data: JSON.stringify(input_url),
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            success: function(responseText){
                // output server error or success message:
                showMessage(responseText)
            },
            error: function(error){
                console.log(error);
            }
        })
        // reload data
        .done(function() {
            loadData();
        });
    });


    // LOAD DATA from server api
    function loadData() {
        $.ajax({
            url: '/webpage_data',
            type: 'GET',
            success: function(response){
                var data = JSON.parse(response);  //need to parse to object
                var reversed_data = data.reverse();
                var output = '';
                // create a card for each document in db
                for (var i in reversed_data) {
                output +=   '<div class="row">' +
                                '<div class="card-container col-xs-10 col-sm-11">' +
                                    '<a class="card" target="_blank" href="' + reversed_data[i].url + '">' +
                                        '<div class="panel panel-primary">' +
                                            '<div class="panel-heading">' +
                                                '<h4>' + reversed_data[i].title + '</h4>' +
                                            '</div>' +
                                            '<div class="panel-body">' +
                                                '<p>' + reversed_data[i].description + '</p>' +
                                                '<p class="text-muted small url">' + reversed_data[i].url + '</p>' +
                                            '</div>' +
                                        '</div>' +
                                    '</a>' +
                                '</div>' +
                                '<div class="card-buttons col-xs-2 col-sm-1">' +
                                    '<button type="button" name="remove-card" class="btn btn-default" id="removeCardBtn" aria-label="Left Align" title="remove" value="' + reversed_data[i].url + '">' +
                                        '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                                    '</button>' +
                                    '<button type="button" class="btn btn-default" id="editCard" aria-label="Left Align" title="edit">' +
                                        '<span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>';
        
                }
                $('#cards').html(output);
            },
            error: function(error){
                console.log(error);
            }
        });
    };

    // show error or success messages from the server api
    function showMessage(response) {
    var output = '';
        if (response.results.hasOwnProperty('error')) {
        var errors = (response.results.error);
            for (var i in errors) {
            output +=   '<div class="alert alert-danger" role="alert">' +
                            '<strong>Error! </strong>' + errors[i] +
                        '</div>'
            }
        } else if (response.results.hasOwnProperty('success')) {
            var success = (response.results.success);
            output +=   '<div class="alert alert-success" role="alert">' +
                            '<strong>Yey! </strong>' + success +
                        '</div>'

            }
        $('#server-message').html(output).hide().fadeIn(300);
    };

//load data on initial page load
loadData();
});