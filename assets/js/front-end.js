if (navigator.onLine) {
    $('#internet-access-indicator').addClass('led-green');
} else{
    $('#internet-access-indicator').addClass('led-red');
}

$(document).ready(function(){
    // This button will increment the value
    $('[data-quantity="plus"]').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('data-field');
        // Get its current value
        let currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
    // This button will decrement the value till 0
    $('[data-quantity="minus"]').click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('data-field');
        // Get its current value
        let currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
});

count = 1;
countEl = document.getElementById("count");
function plus(){
    count++;
    countEl.value = count;
}
function minus(){
    if (count > 1) {
        count--;
        countEl.value = count;
    }
}
//Change value inside input

$('.quantity').each(function() {
    let spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

    btnUp.click(function() {
        let oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            newVal = oldValue;
        } else {
            newVal = oldValue + 1;
        }
        spinner.closest('form').find(".cartridge-storage").val(newVal);
        spinner.find("input").trigger("change");
    });

    btnDown.click(function() {
        let oldValue = parseFloat(input.val());
        if (oldValue <= min) {
            newVal = oldValue;
        } else {
            newVal = oldValue - 1;
        }
        spinner.closest('form').find(".cartridge-storage").val(newVal);
        spinner.find("input").trigger("change");
    });
});

//Sends data to back-end
$('form input').change(function() {
    $(this).closest('form').submit();
    $(this).closest('form').find('.cartridge-name').submit();
    $(this).closest('form').closest('.printer').find('.printer-title').submit();
    console.log( $(this).closest('form').closest('.printer').find('.printer-title'));
    console.log($(this).closest('.printer').find('.printer-title').val());
});

//Retain scroll location after reload
$(window).scroll(function() {
    sessionStorage.scrollTop = $(this).scrollTop();
});

$(document).ready(function() {
    if (sessionStorage.scrollTop !== "undefined") {
        $(window).scrollTop(sessionStorage.scrollTop);
    }
});

//toggle data on click

    $('.hidden-button').click(()=> {
        console.log('clicked');
        $('#additional-data').toggle();
    });
   /* let selected_element = document.getElementById("additional-data");
    if (selected_element.style.display === "none") {
        selected_element.style.display = "block";
        selected_element.style.margin = '0 0 20px 30px;'
    } else {
        selected_element.style.display = "none";
    }*/
