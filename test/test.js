QUnit.test("Hello test!", function(assert){
    assert.ok(1 == "1", "Passed");
});

QUnit.test("Test sync access token", function(assert){
    syncSetStravaAccessToken("test");
    var result = syncGetStravaAccessToken();
    assert.equal(result, "test");
});

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
