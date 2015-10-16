function save_strava_access_token() {
    $("#jsonResponse").text("");
    var accessToken = $('#strava_access_token').val();
    console.log("Token: " + accessToken);
    var status = $('#status');
    status.text('Access token saved.');
    setTimeout(function() {
	status.text('');
    }, 750);
    syncSetStravaAccessToken(accessToken);
}

function load_options() {
    var token = "";
    $("#jsonResponse").text("");
    chrome.storage.sync.get({
	stravaAccessToken: ""
    }, function(items) {
	token = items.stravaAccessToken;
	$('#strava_access_token').val(token);
	var athleteEndpoint = "https://www.strava.com/api/v3/athlete";
	var url = athleteEndpoint + "?access_token=" + token;
	console.log(url);
	$.ajax({
	    url: url,
	    data: {
		format: 'json'
	    },
	    success: function(data){
		$("#jsonResponse").css("color", "black");
		$("#jsonResponse").text(JSON.stringify(data));
	    },
	    error: function(data) {
		if(data != null){
		    $("#jsonResponse").text(JSON.stringify(data));
		} else {
		    $("#jsonResponse").text("Unexpected Error.");
		}
		$("#jsonResponse").css("color", "red");
	    }

	});
    });
}

function syncSetStravaAccessToken(accessToken){
    chrome.storage.sync.set({
	stravaAccessToken: accessToken
    });
}

function syncGetStravaAccessToken(){
    var token = '';
    chrome.storage.sync.get({
	stravaAccessToken: ""
     }, function(items) {
	token = items.stravaAccessToken;
     });
    return token;
}

function secondsToClockTime(seconds){
    var frac = 0;
    var units = [3600, 60, 1];
    var clockParts = [0, 0, 0];
    for(var i = 0; i < units.length; i++){
	var frac = 0;
	if(seconds != 0 && (frac = seconds / units[i]) >=1){
	    clockParts[i] = parseInt(frac);
	    seconds = seconds - (units[i] * clockParts[i]);
	}
    }
    var clock = "";
    for(var i = 0; i < 3; i++){
	clock += (clockParts[i] > 10 ? clockParts[i].toString() : "0" + clockParts[i].toString()) + ":";
    }
    return clock.substr(0,8);
}
