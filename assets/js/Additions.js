if (navigator.onLine) {
    $('.internet-access-notification').text('You have internet');
    $('#internet-access-indicator').addClass('led-green');
} else{
    $('.internet-access-notification').text('You are offline').attr('style','color:red');
    $('#internet-access-indicator').addClass('led-red');
}
let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let date = new Date();
let last_updated = 'Last updated: '+ date.getHours() + ':' +("0" + date.getMinutes()).slice(-2)+' ' +date.getDate()+'. '+ monthNames[date.getMonth()];
$('.data-last-updated').text(last_updated);

let pr_tln_10k_HP2420n_curretn_inc = parseInt($('#pr_tln_10k_HP2420n').text());
let pr_tln_10k_HP2420n_inc_precent = (pr_tln_10k_HP2420n_curretn_inc / 12000)*100;
$('#pr_tln_10k_HP2420n_text').text(pr_tln_10k_HP2420n_inc_precent + '%');
$('#pr_tln_10k_HP2420n_black_inc').addClass('bar bar-'+pr_tln_10k_HP2420n_inc_precent + ' gray');

let pr_tln_2k_HP1320n_current_inc =  parseInt($('#pr_tln_2k_HP1320n_current_inc').text());
let pr_tln_2k_HP1320n_inc_precent = Math.round((pr_tln_2k_HP1320n_current_inc/2380)*100);
$('#pr_tln_2k_HP1320n_precent_measurement').addClass('bar bar-' + pr_tln_2k_HP1320n_inc_precent + ' gray');
$('#pr_tln_2k_HP1320n_text').text(pr_tln_2k_HP1320n_inc_precent);

