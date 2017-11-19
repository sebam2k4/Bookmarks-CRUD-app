$(function(){
	$('#addUrl').on("click", function(){
        //capture url from user input
		var input_url = $('#inputUrl').val();
		$.ajax({
			url: '/add_card',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
                // output server error message:
                showMessage(response);
                // reload data:
                loadData();
			},
			error: function(error){
				console.log(error);
			}
		});
    });
});

// figure out how to use propegation as the cards are created using ajax
// how to delete ajax created cards?

$(function(){
	$('#removeUrl').on("click", function(){
        console.log("remove card")
        // capture url from pressed button's value
		var input_url = $('#removeUrl').val();
		$.ajax({
			url: '/remove_card',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
                //console.log("response: " + response);
                loadData();
			},
			error: function(error){
				console.log(error);
			}
		});
    });
});

// load data from server api
function loadData() {
    $(function(){
        $.ajax({
            url: '/webpage_data',
            //data: $('form').serialize(),
            type: 'GET',
            success: function(response){
                var data = JSON.parse(response);  //need to parse to object
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
                                    '<form method="POST" action="">' +
                                        '<button type="button" name="remove-card" class="btn btn-default" id="removeUrl" aria-label="Left Align" title="remove" value="' + reversed_data[i].url + '">' +
                                            '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                                        '</button>' +
                                    '</form>' +
                                    '<button type="button" class="btn btn-default" id="editCard" aria-label="Left Align" title="edit">' +
                                        '<span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>';
        
                }
                $('#output').html(output);
            },
            error: function(error){
                console.log(error);
            }
        });
    });
};


$(document).ready(function() {
    loadData();
});

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
    $('.server-message').html(output).hide().fadeIn(300);
};