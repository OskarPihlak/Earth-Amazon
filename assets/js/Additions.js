if (navigator.onLine) {
    $('#internet-access-indicator').addClass('led-green');
} else{
    $('#internet-access-indicator').addClass('led-red');
}
let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let date = new Date();
let last_updated = 'Last updated: '+ date.getHours() + ':' +("0" + date.getMinutes()).slice(-2)+' ' +date.getDate()+'. '+ monthNames[date.getMonth()];
$('.data-last-updated').text(last_updated);

