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
        let fieldName = $(this).attr('data-field');
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
        let fieldName = $(this).attr('data-field');
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
    let form = $(this).closest('form');
    form.submit();
    form.find('.cartridge-name').submit();
    form.closest('.printer').find('.printer-title').submit();
});


function savePrinterData(data){
    let ip =$('#'+ data +'-ip.admin_input');
    let name = $('#'+ data +'-name.admin_input');
    let key = $('#'+ data +'-key.admin_input');
   ip.attr('value', ip.val());
   name.attr('value', name.val());
    key.submit();
    ip.submit();
    name.submit();
}






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
function reply_click(clicked_id)
{
    $('.' + clicked_id).toggle();
}
//admin
//printer adding form
$(function() {
    // contact form animations
    $('#contact').click(function() {
        $('#contactForm').fadeToggle();
    });
    $(document).mouseup(function (e) {
        let container = $("#contactForm");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.fadeOut();
        }
    });
});

//change
