QUnit.test("Hello test!", function(assert){
    assert.ok(1 == "1", "Passed");
});

QUnit.asyncTest("Test sync access token", function(assert){
    ACCESS_TOKEN_KEY = "stravaAccessTokenTest";
    expect(1);
    syncSetStravaAccessToken("test");
    syncGetStravaAccessToken(
	function(item){ 
	    result = item.stravaAccessTokenTest;
	    assert.equal(result, "test");
	    QUnit.start();
	}
    );
});

QUnit.asyncTest("Test sync run goal", function(assert){
    RUN_GOAL_KEY = "runGoalTest";
    expect(1);
    syncSetGoal('run', 4567);
    syncGetGoal('run',
    function(item){ 
        result = item.runGoalTest;
        assert.equal(result, 4567);
        QUnit.start();
    }
    );
});

QUnit.asyncTest("Test sync ride goal", function(assert){
    RIDE_GOAL_KEY = "rideGoalTest";
    expect(1);
    syncSetGoal('ride', 1234);
    syncGetGoal('ride',
    function(item){ 
        result = item.rideGoalTest;
        assert.equal(result, 1234);
        QUnit.start();
    }
    );
});

QUnit.test("Test getGoalKey", function(assert){
    var runKey = getGoalKey('run');
    var rideKey = getGoalKey('ride');
    var invalid = getGoalKey('fjdlkajdl');
    var invalidNull = getGoalKey(null);
    assert.ok(runKey == RUN_GOAL_KEY, "Failed to getting run key");
    assert.ok(rideKey == RIDE_GOAL_KEY, "Failed to getting ride key");
    assert.ok(invalid == null, "Failed when passed invalid data");
    assert.ok(invalidNull == null, "Failed when passed null data")
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

QUnit.test("Test activty html row creation", function(assert){
    var actual = createActivityHtmlRow(transformedActivity);
    assert.equal(actual, sampleHtmlListItem);
});

QUnit.test("Test profile html row creation", function(assert){
    var actual = createUserProfileHtml(userProfile);
    assert.equal(actual, sampleHtmlProfile);
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

var userProfile = {
  "id": 227615,
  "resource_state": 3,
  "firstname": "John",
  "lastname": "Applestrava",
  "profile_medium": "http://pics.com/227615/medium.jpg",
  "profile": "http://pics.com/227615/large.jpg",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "sex": "M",
  "friend": null,
  "follower": null,
  "premium": true,
  "created_at": "2008-01-01T17:44:00Z",
  "updated_at": "2013-09-04T20:00:50Z",
  "follower_count": 273,
  "friend_count": 19,
  "mutual_friend_count": 0,
  "athlete_type": 0,
  "date_preference": "%m/%d/%Y",
  "measurement_preference": "feet",
  "email": "john@applestrava.com",
  "ftp": 280,
  "weight": 68.7,
  "clubs": [
    {
      "id": 1,
      "resource_state": 2,
      "name": "Team Strava Cycling",
      "profile_medium": "http://pics.com/clubs/1/medium.jpg",
      "profile": "http://pics.com/clubs/1/large.jpg"
    }
  ],
  "bikes": [
    {
      "id": "b105763",
      "primary": false,
      "name": "Cannondale TT",
      "distance": 476612.9,
      "resource_state": 2
    },
    {
      "id": "b105762",
      "primary": true,
      "name": "Masi",
      "distance": 9000578.2,
      "resource_state": 2
    }
  ],
  "shoes": [
    {
      "id": "g1",
      "primary": true,
      "name": "Running Shoes",
      "distance": 67492.9,
      "resource_state": 2
    }
  ]
}

var transfomedUserProfile = {

}

var sampleHtmlListItem = "<li><a class='avatar-athlete' href='https://www.strava.com/activities/412175084'><img class='avatar' src='https://dgalywyr863hv.cloudfront.net/pictures/athletes/3354133/1155362/2/medium.jpg'><strong>J. Haapala</strong> rode 16.86 mi <strong>HipHopkins</strong></a></li>";

var sampleHtmlProfile = "<a class='avatar-athlete' href='https://www.strava.com/athletes/227615'><img class='avatar' src='http://pics.com/227615/medium.jpg'><strong>John Applestrava</strong></a>";