var simpleFormPast = {"Ride" : "rode",
		     "Run" : "ran"}

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

function metersToMiles(meters){
    return (meters * 0.00062137).toFixed(2);
}

function transformActivity(activity){
    var transformed = {};
    transformed.id = activity.id;
    transformed.name = activity.name;
    transformed.activityLink = "https://www.strava.com/activities/" + activity.id;
    transformed.distance = metersToMiles(activity.distance) + " mi";
    transformed.athleteId = activity.athlete.id;
    transformed.avatar = activity.athlete.profile_medium;
    transformed.moving_time = secondsToClockTime(activity.moving_time);
    transformed.type =  activity.type;
    transformed.start_date = activity.start_date; 
    transformed.has_photos = false;
    transformed.firstName = activity.athlete.firstname;
    transformed.lastName = activity.athlete.lastname;

    return transformed;
}

function createActivityHtmlRow(activity){
    var html = "<li><a class='avatar-athlete' href='" + activity.activityLink + "'>";
    html += "<img class='avatar' src='" + activity.avatar + "'>";
    html += "<strong>" + activity.firstName.charAt(0) + ". " + activity.lastName + "</strong>";
    html += " " + simpleFormPast[activity.type] + " " + activity.distance + " ";
    html += "<strong>" + activity.name + "</strong></a></li>";
    return html;
}

function getUserActivities(){
    syncGetStravaAccessToken(
	function(token){
	   accessToken = token.stravaAccessToken;
	    var promise = $.ajax({
	       url: 'https://www.strava.com/api/v3/activities/following?per_page=10&access_token=' + accessToken
	   }).done(
	       function(json){
		   html = "<ul>";
		   for(var i = 0; i < json.length; i++){
		       var trans = transformActivity(json[i]);
		       html +=  createActivityHtmlRow(trans);  
		   }
		   html += "</ul>";
		   $('#status').remove();
		   $('.dropdown').append(html);
	       }
	   ).fail(
	       function(json){
		   $('#status').append(JSON.stringify(json));
	       }
	   );
	}
    );
}

function syncSetStravaAccessToken(accessToken){
    chrome.storage.sync.set({
	stravaAccessToken: accessToken
    });
}

function syncGetStravaAccessToken(callback){
    chrome.storage.sync.get("stravaAccessToken", callback);
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

$(document).ready(function(){
    if( $('.popup-page').length == 1 ){
	getUserActivities();
	 $('body').on('click', 'a', function(){
	     chrome.tabs.create({url: $(this).attr('href')});
	     return false;
	 });
    }

    if( $('.options-page').length ==1 ){
	
	load_options();

	$('#save').click(function(){
	    save_strava_access_token();
	    load_options();
	});
    }
});
