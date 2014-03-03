/*
$.support.cors = true;

//pull JSON from file
var daily_data = (function () {
    var daily_data = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': '/data/daily.json',
        'dataType': "json",
        'success': function (data) {
            daily_data = data;
        }
    });
    return daily_data;
})();

var max_stepper = daily_data['ranks']['avg_steps'][0];
var max_steps = daily_data['users'][max_stepper]['stats']['total_steps'];

//fetches user + stat
function getUserStat(userId, stat) {
    var currentUser = daily_data['users'][userId]; //current user
    var person = new Array(); //accumulate individual stats
    person['name'] = currentUser.name;
    userStat = currentUser['stats'][stat];
    person['data'] = [parseInt(userStat)];
    return person;
}

function getUserStepsGoal( userId ) {
    var currentUser = daily_data['users'][userId];
	
    var targetSteps = [];
    targetSteps['name'] = "Target";
    targetSteps['color'] = "#cccccc";
    targetSteps['data'] = new Array();
    for ( i = 0; i <= 100; i++) { 
        targetSteps['data'].push( 10000 * i );
    }

    var personSteps = new Array();
    personSteps['name'] = currentUser.name;
    personSteps['color'] = getColor( currentUser.stats.avg_steps );
	personSteps['data'] = new Array();
    for ( var day in daily_data['daily'][userId] ) {
        personSteps['data'].push( Math.round(daily_data['daily'][userId][day]['total_steps']));
    }

    var personProjected = new Array();
    personProjected['name'] = "Projected";
    personProjected['color'] = getColor( currentUser.stats.avg_steps );
    personProjected ['dashStyle'] = "Dash";
	personProjected['data'] = new Array();
    for ( i = 0; i < personSteps['data'].length - 1; i++ ) {
        personProjected['data'].push( null );
    }
	var j = 1;
    for ( i = personSteps['data'].length - 1; i <= 100; i++ ) {
        personProjected['data'].push( Math.round( currentUser.stats.total_steps + ( j * currentUser.stats.avg_steps ) ) );
		j++;
    }
	
    return [ personSteps, targetSteps, personProjected ];
}

//fetches user + aray of re-occuring stats
function getUserDaily(id, stat) {
    var currentUser = daily_data['daily'][id]; //current user
    var person = new Array(); //accumulate individual stats
    person['name'] = [daily_data['users'][id]['name']];
    person['data'] = new Array();

    for (var day in currentUser) {
        person['data'].push(parseInt(currentUser[day][stat]));
    }
    return person;
}

//fetches user + stat for everyone
function getTeamStats( stat ) {
    var teamTotals = [];
    var userList = daily_data['ranks'][stat];
    for ( var userId in userList ) {
        teamTotals.push( getUserStat(userId, stat) );
    }
    return teamTotals.sort(sortByData);
}

//fetches user + array of daily stats for everyone
function getTeamDaily( stat ) {
    var teamTotals = [];
    for ( var i in daily_data.ranks.avg_steps ) {
        teamTotals.push( getUserDaily( daily_data.ranks.avg_steps[i], stat ) );
    }
    return teamTotals;
}

//Sorts array by comparing the data of each person
function sortByData(a, b) {
    return a.data - b.data;
}
//helper: isolate user object
function getNamebyId(id) {
    return daily_data['users'][id]['name'];
}
//construct leaderboard tile for given user
function buildUserSummary( userId, stat ) {
    currentUser = daily_data['users'][userId];
    userStat = currentUser['stats'][stat];
    var color = "#000000";
    var avatar = currentUser.avatar_normal;

    if (stat == 'total_steps') {
		color = getColor( currentUser.stats.avg_steps );
        if (userStat > 10000) {
            avatar = getStepsAvatar( userId );
        }
    }
    //returns HTML w/ avatar, name, requested stat
    return '<a href="#" onclick="loadProfile(' + "'" + userId + "'" + ');">' +
	    '<div class="leaderboard_spot" style="' + backgroundProgressBar(currentUser.stats.total_steps) + '" "">' +
        '<img src="' + avatar + '"" width="50" height="50">' +
        '<div class="user_ranking_number">' + currentUser.rank.avg_steps + '</div>' +
        '<div class="user_ranking_name">' + currentUser.name + '</div>' +
        '<div class="ranking_stat" style="color:' + color + '">' + commaSeparateNumber(Math.round(userStat)) + '</div></div></a>';
}

function getStepsAvatar( userId ) {
    var currentUser = daily_data['users'][userId];
    var avatar = currentUser.avatar_normal;
    if ( currentUser.stats.avg_steps > 10000 ) {
		avatar = currentUser.avatar_track;
    }
	if ( currentUser.rank.avg_steps == 1 ) {
        avatar = currentUser.avatar_winning;		
	}
	return avatar;
}

function getColor( avgSteps ) {
	var colorFun = ( avgSteps - 10000 );
	var color = '#000000';
	colorFun = ( colorFun > 5000 ) ? 5000 : colorFun;
	colorFun = ( colorFun < -2500 ) ? -2500 : colorFun;
	if ( colorFun >= 0 ) {
		colorFun = Math.round((colorFun/5000)*187);
		var hexColor = colorFun.toString(16);
		if ( hexColor.length < 2 ) {
			hexColor = '0' + hexColor;
		}
		color = '#00' + hexColor + '00';
	}
	else {
		colorFun = Math.round((colorFun/2500)*-255);
		var hexColor = colorFun.toString(16);
		if ( hexColor.length < 2 ) {
			hexColor = '0' + hexColor;
		}
		color = '#' + hexColor + '0000';
	}
	return color;
}

function backgroundProgressBar(steps) {
    percent = steps / max_steps * 100 + "%";
    leftColor = '#fff';
	rightColor = '#eee';

    return 'background-image: linear-gradient(left, ' + leftColor + " " + percent + ', ' + rightColor + ' 50%);' +
        'background-image: -o-linear-gradient(left, ' + leftColor + " " + percent + ', ' + rightColor + ' 50%);' +
        'background-image: -moz-linear-gradient(left, ' + leftColor + " " + percent + ', ' + rightColor + ' 50%);' +
        'background-image: -webkit-linear-gradient(left, ' + leftColor + " " + percent + ', ' + rightColor + ' 50%);' +
        'background-image: -ms-linear-gradient(left, ' + leftColor + " " + percent + ', ' + rightColor + ' 50%);';
}

function listUsersBy(stat) {
    $("#header_text").append( ' - Day ' + daily_data.meta.day );
	
    var rankList = daily_data['ranks'][stat];
    var acc = "";
    for ( var userId in rankList ) {
		// Hard-coded total_steps for now
        acc = acc + buildUserSummary( rankList[userId], 'total_steps' );
    }
    return acc;
}

function loadProfile( userId ) {
    window.localStorage.setItem( 'selectedUserID', userId );
    document.location.href = 'profile.html';
}

function freebiesUsed(freebs) {
    var freebiesHTML = '';

    for (i = freebs; i > 0; i--) {
        freebiesHTML += '<img src="/images/freebie_on.png">';
    }
    for (i = freebs; i < 3; i++) {
        freebiesHTML += '<img src="/images/freebie_off.png">';
    }
    return freebiesHTML;
}

function populateProfileView() {
    var userId = window.localStorage.getItem('selectedUserID');
    var currentUser = daily_data['users'][userId];
	var color = getColor( currentUser.stats.avg_steps );

    //user info
    $("#user_name").append(currentUser.name);
    $("#user_rank").append(currentUser.rank.avg_steps);

    var avatar = currentUser['avatar_normal'];
    if ( currentUser.stats.avg_steps > 10000 ) {
        avatar = currentUser['avatar_track'];
    }

    $("#user_avatar").append('<img src="' + avatar + '"" width="130" height="130" ">');
    $("#user_steps_total").append( '<p style="color:' + color + '">' + commaSeparateNumber(currentUser.stats.total_steps) + '</p>' );
    $("#user_floors_total").append(commaSeparateNumber(currentUser.stats.total_floors));
    $("#freebies").append(freebiesUsed(currentUser.stats.freebies_used));

    //steps stats
    $("#user_steps_surplus").append( ( (currentUser.stats.surplus > 0) ? '+' : '' ) + commaSeparateNumber(Math.round(currentUser.stats.surplus)) );
    $("#user_steps_needed").append( commaSeparateNumber(Math.round(currentUser.stats.avg_steps_remaining)) );
    if (currentUser.stats.on_track) {
        $("#user_steps_on_track").append('<div id="thumbs_up"></div>');
    } else {
        $("#user_steps_on_track").append('<div id="thumbs_down"></div>');
    }

    $("#user_steps_min").append('<p style="color:' + getColor( currentUser.stats.low_steps ) + '">' + commaSeparateNumber(Math.round(currentUser.stats.low_steps)) + '</p>');
    $("#user_steps_average").append('<p style="color:' + getColor( currentUser.stats.avg_steps ) + '">' + commaSeparateNumber(Math.round(currentUser.stats.avg_steps)) + '</p>');
    $("#user_steps_max").append('<p style="color:' + getColor( currentUser.stats.high_steps ) + '">' + commaSeparateNumber(Math.round(currentUser.stats.high_steps)) + '</p>');

    //floors stats
    $("#user_floors_min").append(currentUser.stats.low_floors);
    $("#user_floors_avg").append(Math.round(currentUser.stats.avg_floors));
    $("#user_floors_max").append(currentUser.stats.high_floors);

    $("#user_challengers").append(generateStanding(userId));

}

function commaSeparateNumber( val ) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function generateStanding( userId ) {
    var currentRank = daily_data['ranks']['avg_steps'].indexOf(userId) + 1;
    var aboveRank = currentRank - 1;
    var belowRank = currentRank + 1;
    var aboveRankID = daily_data['ranks']['avg_steps'][aboveRank-1];
    var belowRankID = daily_data['ranks']['avg_steps'][belowRank-1];

    //collects users
    accumulator = '';

    // higher user
    if ( currentRank > 1 ) {
        accumulator += generate_challenger( userId, aboveRankID );
    }
    // current user
    accumulator += generate_challenger( userId, userId  );
    // lower user
    if ( currentRank != daily_data['ranks']['avg_steps'].length ) {
        accumulator += generate_challenger( userId, belowRankID );
    }
    return accumulator;
}

function generate_challenger( userId, compUserId ) {
	var currentUser = daily_data['users'][userId];
    var compUser = daily_data['users'][compUserId];
    var compAvatar = getStepsAvatar( compUserId );
    var compRank = compUser.rank.avg_steps;
    var compDiff = compUser.stats.total_steps - currentUser.stats.total_steps;
    var displayStat = 0;

    if ( userId == compUserId ) {
        displayStat = commaSeparateNumber( currentUser.stats.total_steps );
		color = '#000000';
    }
	else if ( compDiff > 1 ) {
        displayStat = '+' + commaSeparateNumber( compDiff );
        color = "#00CC00";
    }
	else if ( compDiff < 0) {
        displayStat = '-' + commaSeparateNumber( compDiff );
        color = "#FF0000";
    }

    return '<a href="#" onclick="loadProfile(' + "'" + compUserId + "'" + ');">' +
	    '<div  class="leaderboard_spot" style="' + backgroundProgressBar(compUser.stats.total_steps) + '" "">' +
        '<img src="' + compAvatar + '"" width="50" height="50">' +
        '<div class="user_ranking_number">' + compRank + '</div>' +
        '<div class="user_ranking_name">' + compUser.name + '</div>' +
        '<div class="ranking_stat" style="color:' + color + '">' + displayStat + '</div></div></a>';
}

*/
