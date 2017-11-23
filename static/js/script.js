$(document).ready(function() {
    //load data on page load
    loadData();

    // LOAD DATA from server api
    function loadData() {
        $.ajax({
            url: '/webpage_data',
            type: 'GET',
            success: function(response){
                var data = JSON.parse(response);  //need to parse to object
                // reverse the order of the data so newest card appears on top
                var reversed_data = data.reverse();
                var output = '';
                // create a card for each document in db
                for (var i in reversed_data) {
                output +=   '<div class="row card-container" data-identifier="' + reversed_data[i].url + '">' +
                                '<div class="col-xs-10 col-sm-11">' +
                                    '<a class="card" target="_blank" href="' + reversed_data[i].url + '">' +
                                        '<div class="panel panel-primary">' +
                                            '<div class="panel-heading">' +
                                                '<h4 class="edit-h4">' + reversed_data[i].title + '</h4>' +
                                            '</div>' +
                                            '<div class="panel-body">' +
                                                '<p class="edit-p">' + reversed_data[i].description + '</p>' +
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
                // add all the cards to index.html
                $('#cards').html(output);
            },
            error: function(error){
                console.log(error);
            }
        });
    };

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
                showServerMessage(response);
            },
            error: function(error){
                console.log(error);
            }
        })
        .done(function() {
            // reload data
            loadData();
        });
    });

    // REMOVE CARD
    // .on method with delegated event needed for click event to work on created html elements by loadData()
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
                showServerMessage(responseText)
            },
            error: function(error){
                console.log(error);
            }
        })
        .done(function() {
            // reload data
            loadData();
        });
    });


    // EDIT CARD
    // NOTE TO SELF: clean this up - looks really messy and code could possibly be improved.
    // Read up jquery docs and investigate some ways to imporove and simplify
    $('#cards').on("click", '.editCardBtn', function(){
        // disable links to prevent opening the card's link while in edit mode
        $('a').on('click', function(element){
            element.preventDefault();
        })
        // get the button's value (url)
        var value = $(this).val();
        //make a list of all cards
        var card_list = $('.card-container');
        // get the data attribute for matching card (url)
        var card_match_identifier = $(this).closest('.card-container').data('identifier');
        // hide SAVE button for matching card card
        $('.saveCardBtn').hide();
        // hide buttons for other cards when in card edit mode
        $('.editCardBtn').not(this).closest('.card-buttons').toggle();

        // get 2 seperate lists for all titles and descriptions of all cards
        var all_titles = $(card_list).find('.edit-h4');
        var all_descriptions = $(card_list).find('.edit-p');
        // initialize variables
        var title = '';
        var description = '';
        // iterate through every card
        //var original_title_text = '';
        for (var i = 0; i < card_list.length; i++) {
            title = $(card_list[i]).find('.edit-h4');
            description = $(card_list[i]).find('.edit-p');
            var original_title_text = title.text(); //how to compare this to new text?

            // Match edit button with its corresponding card (matching cards based on card's data attr and button's value)
            if (card_list.eq(i).data('identifier') == value) {       // card_list[0].getAttribute("data-identifier");
                
                // cancel card edit on 2nd button click
                // NOTE TO SELF: figure out how to revert edited text back to original on cancel
                if (title.attr('contenteditable')) {
                    // disable active editable content
                    title.removeClass('active').removeAttr('contenteditable','true');
                    description.removeClass('active').removeAttr('contenteditable','true');
                    // remove click event to re-enable card links after edit cancel
                    $('a').off('click');
                    // hide save button
                    $('.saveCardBtn').hide();
                    // bring back buttons for other cards
                    $(".card-buttons").show();
                } else {
                    // show save button
                    $(this).next().fadeIn(300);
                    // clear any active editable content first
                    all_titles.removeClass('active').removeAttr('contenteditable','true');
                    all_descriptions.removeClass('active').removeAttr('contenteditable','true');
                    // activate editable content for corresponding card
                    title.addClass('active').attr('contenteditable','true');
                    description.addClass('active').attr('contenteditable','true');
                    // focus workaround for contentEditable attribute (places caret at begining of line though :( 
                    setTimeout(function() {
                        title.focus();
                    }, 0);
                }
            }
        } 
    });

    // SAVE EDITED CARD
    // NOTE TO SELF: clean this up - looks really messy and code could possibly be improved.
    // Read up jquery docs and investigate some ways to imporove and simplify
    $('#cards').on("click", '.saveCardBtn', function(){
        // remove click event to re-enable card links after save
        $('a').off('click')
        
        var value = $(this).val();
        //make a list of all cards
        var card_list = $('.card-container');
        // get the data attribute for matching card (url)
        var card_match_identifier = $(this).closest('.card-container').data('identifier');
        // initialize variables
        var title = '';
        var description = '';
        var title_text = '';
        var description_text = '';

        // iterate through every card
        for (var i = 0; i < card_list.length; i++) {
            title = $(card_list[i]).find('.edit-h4');
            description = $(card_list[i]).find('.edit-p');

            // Match save button with its corresponding card
            if (card_list.eq(i).data('identifier') == value) {
                // Save coresponding card's edited content and remove borders & disable editable content.
                title.removeClass('active').removeAttr('contenteditable','true');
                description.removeClass('active').removeAttr('contenteditable','true');
                title_text = title.text();
                description_text = description.text();
            }
        }
        // Save edited content to db
        var input_url = value;
        $.ajax({
            url: '/update_card',
            data: JSON.stringify({'url': input_url, 'title':title_text, 'description':description_text}),
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            success: function(response){
                // output server error or success message:
                showServerMessage(response);
            },
            error: function(error){
                console.log(error);
            }
        })
        .done(function() {
            // don't need to reload data here after edit save. The front-end is updated already
            // loadData();
            // hide save button after save
            $('.saveCardBtn').fadeOut(150);
            // bring back buttons for other cards after save
            $(".card-buttons").show();
        });
    });

    // show error or success messages from the server api
    function showServerMessage(response) {
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
});