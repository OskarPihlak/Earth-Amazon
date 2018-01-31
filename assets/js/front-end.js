if (navigator.onLine) {
    $('#internet-access-indicator').addClass('led-green');
} else {
    $('#internet-access-indicator').addClass('led-red');
}

$(document).ready(function () {
    // This button will increment the value
    $('[data-quantity="plus"]').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        let fieldName = $(this).attr('data-field');
        // Get its current value
        let currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name=' + fieldName + ']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name=' + fieldName + ']').val(0);
        }
    });
    // This button will decrement the value till 0
    $('[data-quantity="minus"]').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        let fieldName = $(this).attr('data-field');
        // Get its current value
        let currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[name=' + fieldName + ']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name=' + fieldName + ']').val(0);
        }
    });
});

count = 1;
countEl = document.getElementById("count");

function plus() {
    count++;
    countEl.value = count;
}

function minus() {
    if (count > 1) {
        count--;
        countEl.value = count;
    }
}

//Change value inside input
$('.quantity').each(function () {
    let spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

    btnUp.click(function () {
        let oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            newVal = oldValue;
        } else {
            newVal = oldValue + 1;
        }
        spinner.closest('form').find(".cartridge-storage").val(newVal);
        spinner.find("input").trigger("change");
    });

    btnDown.click(function () {
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
$('form input').change(function () {
    let form = $(this).closest('form');
    form.submit();
    form.find('.cartridge-name').submit();
    form.closest('.printer').find('.printer-title').submit();
});

//Retain scroll location after reload
$(window).scroll(function () {
    sessionStorage.scrollTop = $(this).scrollTop();
});
$(document).ready(function () {
    if (sessionStorage.scrollTop !== "undefined") {
        $(window).scrollTop(sessionStorage.scrollTop);
    }
});

//toggle data on click
function reply_click(clicked_id) {
    $('.' + clicked_id).toggle();
}

//change width on positioning toggle
$('.toggle-position').click(function () {
    $('.printer-marker-positioning').toggle();
});

function savePrinterData(data) {
    let password_autentication = prompt('Enter the password to UPDATE printer');
    if (password_autentication === 'Midagi1lusat') {
        let ip = $('#' + data + '-ip.admin_input').val($('#' + data + '-ip').val()).submit();
        let name = $('#' + data + '-name.admin_input').val($('#' + data + '-name').val()).submit();
        let key = $('#' + data + '-key.admin_input').submit();
        let color = $('#' + data + '-color').val(!!$('.input-identification-color-' + data).is(":checked")).submit();
        let max_capacity = $('#' + data + '-max-capacity').val(!!$('.input-identification-max-capacity-' + data).is(":checked")).submit();
        let floor = $('#' + data + '-floor').val($('#input-status-floor-'+data).val()).submit();
        let oldname = $('#'+ data +'-old-name').val().submit();
    } else {
        alert('Wrong password');
    }
}

function repositionMarker(data) {
    setTimeout(() => {
        let top = parseInt($('#top-' + data).val());
        let left = parseInt($('#left-' + data).val());
        let adjustedTopHeight = 20 + top;
        $('.top-post').val(top);
        $('.left-post').val(left);
        $('#line-top-' + data).attr('style', 'height:' + adjustedTopHeight + 'px; top:' + (-20 - top) + 'px;');
        $('#line-left-' + data).attr('width', (left - 180) + 'px;');
        $('#led-positioning-' + data).attr('style', 'top: ' + top + 'px;left: ' + left + 'px;');
        $('#additional-data-positioning-' + data).attr('style', 'top: ' + top + 'px;left: ' + left + 'px; display:block');
    }, 20)
}

function valueChanged(data) {
   console.log('change');
    if($('#'+data).is(":checked")) { $('.printer-' + data).show();}
    else { $('.printer-' + data).hide(); }
}

function modifyToggle(data) {
    let printer_name = $('#' + data + '-name');
    let printer_ip = $('#' + data + '-ip');
    $('#save-' + data).toggle();
    $('#delete-' + data).toggle();
    $("#row-" + data).toggleClass("tr-toggle");
    $('.identification-' + data).toggle();
    $('.input-identification-color-' + data).toggleClass('input-display');
    $('.input-identification-max-capacity-' + data).toggleClass('input-display');
    $('.static-floor-data-'+data).toggle();
    $('#input-status-floor-'+data).toggleClass('input-display');
    $('#modify-'+data).toggleClass('input-admin-buttons-timmed');
    $('#'+ data +'-old-name').val(printer_name.val());
    $('#printer-name-'+data).toggle();
    $('#printer-ip-'+data).toggle();
    printer_name.toggleClass('input-toggle');
    printer_name.toggleClass('input-display');
    printer_ip.toggleClass('input-toggle');
    printer_ip.toggleClass('input-display');
}

function infoToggle(data){
    $('#div-info-'+data).toggleClass('input-display');
    $('#button-info-'+data).toggleClass('input-admin-buttons-timmed');
}

function addPrinter() {
    let input_ip = $('#input-ip-submit').val($('#input-ip').val()).submit();
    let input_name =$('#input-name-submit').val($('#input-name').val()).submit();
    let input_floor = $('#input-floor-submit').val($('#input-floor').val()).submit();
    let input_color = $('#input-color-submit').val(!!$('#input-color').is(":checked")).submit();
    let input_max_capacity = $('#input-max-capacity-submit').val(!!$('#input-max-capacity').is(":checked")).submit();
}

function deletePrinter(data) {
    let delete_promt = prompt('Enter the password to DELETE the printer');
    if (delete_promt === 'Midagi1lusat') {
        $('#input_name_delete-' + data).val($('#' + data + '-name').val()).submit();
        $('#input_ip_delete-' + data).val($('#' + data + '-ip').val()).submit();
    } else {
        alert('Wrong password');
    }
}
function togglePrinterAdd() {
    $('#printer-creation').toggle();
}

$(document).ready(function() {
        $('body').addClass('loaded');
});
