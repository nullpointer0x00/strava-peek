var simpleFormPast = {"Ride" : "rode",
		     "Run" : "ran"};

var ACCESS_TOKEN_KEY = "stravaAccessToken";
var RUN_GOAL_KEY = "runGoal";
var RIDE_GOAL_KEY = "rideGoal";

function save_strava_access_token() {
    $("#jsonResponse").text("");
    var accessToken = $('#strava_access_token').val();
    var status = $('#status');
    status.text('Access token saved.');
    setTimeout(function() {
		status.text('');
    	}, 750);
    syncSetStravaAccessToken(accessToken);
}

function save_goal(type, val){

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
		$.ajax({url: url})
			.done(function(data){
				$("#jsonResponse").css("color", "black");
				$("#jsonResponse").append(createUserProfileHtml(data));
			})
			.fail(function(response){
				if(response.status == 401){
		    		$("#jsonResponse").text("Error authenticating access token.  Response from server: " + response.responseText);
				} else {
		    		$("#jsonResponse").text("Unexpected Error.");
				}
				$("#jsonResponse").css("color", "red");
			})
			.always(function(){
				//clean stuff
			});
    });
}

function createUserProfileHtml(user){
	var html = "<a class='avatar-athlete' href='https://www.strava.com/athletes/" + user.id + "'>";
    html += "<img class='avatar' src='" + user.profile_medium + "'>";
    html += "<strong>" + user.firstname + " " + user.lastname + "</strong></a>";
    return html;
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
		   var html = "<ul>";
		   for(var i = 0; i < json.length; i++){
		       var trans = transformActivity(json[i]);
		       html +=  createActivityHtmlRow(trans);  
		   }
		   html += "</ul>";
		   $('#status').remove();
		   $('.dropdown').append(html);
	       }
	   ).fail(
	       function(response){
	       		if(response.status == 401){
		   			$('#status').append("<p>Authorization Error.  Please check access_token from the options screen.</p>");
				} else {
					$('#status').append("<p>Unexpected error.  Status: " + response.status);
				}
				$(".spin").removeClass("spin");
	       }
	   );
	}
    );
}

function syncSetStravaAccessToken(accessToken){
    var save = {};
	save[ACCESS_TOKEN_KEY] = accessToken;
    chrome.storage.sync.set( save , function(){
    	console.log(ACCESS_TOKEN_KEY + " : " + accessToken);
    });
}

function syncGetStravaAccessToken(callback){
    chrome.storage.sync.get(ACCESS_TOKEN_KEY, callback);
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
