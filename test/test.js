QUnit.test("Hello test!", function(assert){
    assert.ok(1 == "1", "Passed");
});

QUnit.asyncTest("Test sync access token", function(assert){
    expect(1);
    syncSetStravaAccessToken("test");
    syncGetStravaAccessToken(
	function(item){ 
	    result = item.stravaAccessToken;
	    assert.equal(result, "test");
	    QUnit.start();
	}
    );
});
/*
QUnit.test("Test ajax follow call.", function(assert){
    syncSetStravaAccessToken("test");
    $.mockjaxClear();
    $.mockjax({
        url: 'https://www.strava.com/api/v3/activities/following?access_token=test',
        responseText: ""
    });
    var response = getUserActivites();
    assert.equal(response, "");
});
*/
QUnit.test("Test format second to clock time", function(assert){

    var expected = "00:01:06";
    var actual = secondsToClockTime(66);
    assert.equal(actual, expected);
    
    expected = "00:01:00";
    actual = secondsToClockTime(60);
    assert.equal(actual, expected);

    expected = "00:00:59";
    actual = secondsToClockTime(59);
    assert.equal(actual, expected);
    
    expected = "01:00:00";
    actual = secondsToClockTime(3600);
    assert.equal(actual, expected);
    
    expected = "01:01:06";
    actual = secondsToClockTime(3666);
    assert.equal(actual, expected);
    
    expected = "00:59:59";
    actual = secondsToClockTime(3599);
    assert.equal(actual, expected);

});

QUnit.test("Test yards to miles", function(assert){
    var expected = 16.86
    var actual = metersToMiles(27134.6);
    assert.equal(actual, expected);
});

QUnit.test("Test activity transform", function(assert){
    var actual = transformActivity(sampleActivity);
    assert.deepEqual(actual, transformedActivity, "Some Message");
});

QUnit.test("", function(assert){
    var actual = createActivityHtmlRow(transformedActivity);
    assert.equal(actual, sampleHtmlListItem);
});

var sampleActivity = {
        "id": 412175084,
        "resource_state": 2,
        "external_id": "17acff8eef61248a80dfeec94b6c4567",
        "upload_id": 461795315,
        "athlete": {
            "id": 3354133,
            "resource_state": 2,
            "firstname": "Jacob",
            "lastname": "Haapala",
            "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/3354133/1155362/2/medium.jpg",
            "profile": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/3354133/1155362/2/large.jpg",
            "city": "Minneapolis",
            "state": "MN",
            "country": "United States",
            "sex": "M",
            "friend": "accepted",
            "follower": "accepted",
            "premium": false,
            "created_at": "2013-11-08T18:31:33Z",
            "updated_at": "2015-09-30T14:26:16Z",
            "badge_type_id": 0
        },
        "name": "HipHopkins",
        "distance": 27134.6,
        "moving_time": 3357,
        "elapsed_time": 3407,
        "total_elevation_gain": 32.3,
        "type": "Ride",
        "start_date": "2015-10-13T12:19:35Z",
        "start_date_local": "2015-10-13T07:19:35Z",
        "timezone": "(GMT-06:00) America/Chicago",
        "start_latlng": [
            44.94,
            -93.29
        ],
        "end_latlng": [
            44.98,
            -93.25
        ],
        "location_city": "Minneapolis",
        "location_state": "MN",
        "location_country": "United States",
        "start_latitude": 44.94,
        "start_longitude": -93.29,
        "achievement_count": 17,
        "kudos_count": 0,
        "comment_count": 0,
        "athlete_count": 1,
        "photo_count": 0,
        "map": {
            "id": "a412175084",
            "summary_polyline": "yghqG`}jxPH|K{^JUlNab@V\\h~@aD`kA\\tXdAtJdFxPtU`b@fCjo@bGf_@nqBvkIW`G|CrI|@vKiEnEeFUkq@wZuSqFyIqGoYmKcBaFcKcAoRyKiJcHgJgN_Hca@wCmJuBiBaSadBwBc\\kKev@{Ccb@gSy~AaAoMPy\\_BsOwUssA{LiZkDkFaE{APcFyV_l@aFiVyH}OeLqMIoHwB[uG}IyLc`@y@{LbNmLhAeFnMsNzCmIvGiIrFsPr@iNlDaM@_QxIxF]kB",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "private": false,
        "flagged": false,
        "gear_id": "b1718010",
        "average_speed": 8.083,
        "max_speed": 15.9,
        "average_watts": 160.4,
        "kilojoules": 538.5,
        "device_watts": false,
        "total_photo_count": 0
}

var transformedActivity = {
    "id": 412175084,
    "name" : "HipHopkins",
    "activityLink" : "https://www.strava.com/activities/412175084",
    "distance": "16.86 mi",
    "moving_time": "00:55:57",
    "type": "Ride",
    "start_date": "2015-10-13T12:19:35Z", 
    "has_photos": false,	
    "athleteId" : 3354133,
    "avatar": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/3354133/1155362/2/medium.jpg",	
    "firstName" : "Jacob",
    "lastName" : "Haapala"
}

var sampleHtmlListItem = "<li><a class='avatar-athlete' href='https://www.strava.com/activities/412175084'><img class='avatar' src='https://dgalywyr863hv.cloudfront.net/pictures/athletes/3354133/1155362/2/medium.jpg'><strong>J. Haapala</strong> rode 16.86 mi <strong>HipHopkins</strong></a></li>";
