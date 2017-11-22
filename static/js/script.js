$(document).ready(function() {
    // EDIT CARD
    $('#cards').on("click", '.editCardBtn', function(){
        // disable links to prevent opening the card's link while in edit mode
        $('a').on('click', function(element){
            element.preventDefault();
        })
        // get the button's value (url)
        var value = $(this).val();
        //make a list of all cards
        var card_list = document.getElementsByClassName('card-container')   // var card_list = $('.card-container)
        //var card_list2 = card_list[0].getAttribute("data-identifier");      // and then // card_list[0].data('identifier') doesn't work for some reason //using vanilla js instead.
        //console.log(card_list2)
        //console.log(arr2.data('identifier'))
        // get the data attribute for matching card (url)
        var card_match_identifier = $(this).closest('.card-container').data('identifier'); 
        // hide/show SAVE button
        $('.saveCardBtn').hide();
        $(this).next().fadeIn(300);
        // activate card's editable content and add borders
        for (var i = 0; i < card_list.length; i++) {
            if (card_list[i].getAttribute("data-identifier") == value) {
                $(card_list[i]).find('.edit-h4').addClass('active').attr('contenteditable','true');
                $(card_list[i]).find('.edit-p').addClass('active').attr('contenteditable','true');
            }
        }        
    });

    // SAVE EDITED CARD
    $('#cards').on("click", '.saveCardBtn', function(){
        // remove click event to re-enable card links after save
        $('a').off('click')
        // hide save button after save
        var value = $(this).val();
        console.log(value)
        //make a list of all cards
        var card_list = document.getElementsByClassName('card-container')   // var card_list = $('.card-container)
        console.log(card_list)
        //var card_list2 = card_list[0].getAttribute("data-identifier");      // and then // card_list[0].data('identifier') doesn't work for some reason //using vanilla js instead.
        //console.log(card_list2)
        //console.log(arr2.data('identifier'))
        // get the data attribute for matching card (url)
        var card_match_identifier = $(this).closest('.card-container').data('identifier'); 
        console.log(card_match_identifier)
        // hide/show SAVE button
        $('.saveCardBtn').hide();
        $(this).next().fadeIn(300);
        // activate card's editable content and add borders
        var title = '';
        var description = '';
        for (var i = 0; i < card_list.length; i++) {
            if (card_list[i].getAttribute("data-identifier") == value) {
                $(card_list[i]).find('.edit-h4').removeClass('active').attr('contenteditable','false');
                $(card_list[i]).find('.edit-p').removeClass('active').attr('contenteditable','false');
                title = $(card_list[i]).find('.edit-h4').text();
                description = $(card_list[i]).find('.edit-p').text();
            }
        }

        var input_url = value;
        $.ajax({
            url: '/update_card',
            data: JSON.stringify({'url': input_url, 'title':title, 'description':description}),
            contentType: 'application/json;charset=UTF-8',
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
        $('.saveCardBtn').fadeOut(150);
    });

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
    $('#cards').on("click", '.removeCardBtn', function(){
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
                output +=   '<div class="row card-container" data-identifier="' + reversed_data[i].url + '">' +
                                '<div class="col-xs-10 col-sm-11">' +
                                    '<a class="card" target="_blank" href="' + reversed_data[i].url + '">' +
                                        '<div class="panel panel-primary">' +
                                            '<div class="panel-heading">' +
                                                '<h4 class="edit-h4" contenteditable="false">' + reversed_data[i].title + '</h4>' +
                                            '</div>' +
                                            '<div class="panel-body">' +
                                                '<p class="edit-p" contenteditable="false">' + reversed_data[i].description + '</p>' +
                                                '<p class="text-muted small url">' + reversed_data[i].url + '</p>' +
                                            '</div>' +
                                        '</div>' +
                                    '</a>' +
                                '</div>' +
                                '<div class="card-buttons col-xs-2 col-sm-1">' +
                                    '<button type="button" name="remove-card" class="btn btn-default removeCardBtn"aria-label="Left Align" title="remove" value="' + reversed_data[i].url + '">' +
                                        '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                                    '</button>' +
                                    '<button type="button" name="edit-card" class="btn btn-default editCardBtn" aria-label="Left Align" title="edit" value="' + reversed_data[i].url + '">' +
                                        '<span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                    '</button>' +
                                    '<button type="button" name="save-edit" class="btn btn-default saveCardBtn" aria-label="Left Align" title="save" value="' + reversed_data[i].url + '">' +
                                        '<span class="glyphicon glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>' +
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