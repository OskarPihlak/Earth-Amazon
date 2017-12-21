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
function reply_click(clicked_id)
{
    $('.'+clicked_id).toggle();
}

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

//navbar
$(function() {
    /**
     * for each menu element, on mouseenter,
     * we enlarge the image, and show both sdt_active span and
     * sdt_wrap span. If the element has a sub menu (sdt_box),
     * then we slide it - if the element is the last one in the menu
     * we slide it to the left, otherwise to the right
     */
    $('#sdt_menu').find('> li').bind('mouseenter',function(){
        let $elem = $(this);
        $elem.find('img')
            .stop(true)
            .animate({'opacity':'1'},500) /* fades in semi-tranparent image */
            .addBack()
            .find('.sdt_wrap')
            .stop(true)
            .animate({'top':'110px'},250) /* Moves menu button down */
            .addBack()
            .find('.sdt_active')
            .stop(true)
            .animate({'height':'85px'},250,function(){
                let $sub_menu = $elem.find('#sdt_box');
                if($sub_menu.length){
                    let left = '210px';
                    let count = $('#sdt_box').children('a.count').length; /* Determines how large to make the "sdt_box" div based on the number of links it contains */
                    let count1 = 26;
                    let count2 = 2;
                    let num1 = count*count1;
                    let num2 = count*count2;
                    if($elem.parent().children().length === $elem.index()+1)
                        left = '210px';
                    $sub_menu.show().animate({'left':left,'height':num1+num2},250); /* Animates the "sdt_box" div */
                }
                let $sub_menu1 = $elem.find('#sdt_box1');
                if($sub_menu1.length){
                    let left = '210px';
                    let count = $('#sdt_box1').children('a.count').length; /* Determines how large to make the "sdt_box1" div  based on the number of links it contains */
                    let count1 = 26;
                    let count2 = 2;
                    let num1 = count*count1;
                    let num2 = count*count2;
                    if($elem.parent().children().length === $elem.index()+1)
                        left = '-210px';
                    $sub_menu1.show().animate({'left':left,'height':num1+num2},250); /* Animates the "sdt_box1" div */
                }
                let $sub_menu2 = $elem.find('#sdt_box2');
                if($sub_menu2.length){
                    let left = '210px';
                    let count = $('#sdt_box2').children('a.count').length; /* Determines how large to make the "sdt_box2" div  based on the number of links it contains */
                    let count1 = 26;
                    let count2 = 2;
                    let num1 = count*count1;
                    let num2 = count*count2;
                    if($elem.parent().children().length === $elem.index()+1)
                        left = '-210px';
                    $sub_menu2.show().animate({'left':left,'height':num1+num2},250); /* Animates the "sdt_box2" div */
                }
            });
    }).bind('mouseleave',function(){ /* resets everything */
        let $elem = $(this);
        let $sub_menu = $elem.find('#sdt_box');
        let $sub_menu1 = $elem.find('#sdt_box1');
        let $sub_menu2 = $elem.find('#sdt_box2');
        if($sub_menu.length)
            $sub_menu.hide().css('left','0px');
        $sub_menu.animate({'height':'85'},250);

        if($sub_menu1.length)
            $sub_menu1.hide().css('left','0px');
        $sub_menu1.animate({'height':'85'},250);

        if($sub_menu2.length)
            $sub_menu2.hide().css('left','0px');
        $sub_menu2.animate({'height':'85'},250);

        $elem.find('.sdt_active')
            .stop(true)
            .animate({'height':'0px'},300)
            .addBack().find('img')
            .stop(true)
            .animate({
                'opacity':'0'},400)
            .addBack()
            .find('.sdt_wrap')
            .stop(true)
            .animate({'top':'25px'},500);
    });
});