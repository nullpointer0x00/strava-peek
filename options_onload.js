$(document).ready(function(){

    load_options();

    $('#save').click(function(){
	save_strava_access_token();
	load_options();
    });
});
