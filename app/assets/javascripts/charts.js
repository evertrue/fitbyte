function exists(id){
    return ($(id).length > 0);
}

if ( 1 && exists('#team_cume_steps') ) {
    $(document).ready(function () {
		var stepsData = getTeamDaily('total_steps');
		var days = new Array();
		for ( var i in stepsData ) {
	        days.push( parseInt(i) + 1 );
		}
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'team_cume_steps',
                type: 'spline'
                
            },
			plotOptions: {
	            series: {
	                lineWidth: 2,
					shadow: true,
	                marker: {
	                    enabled: false
	                }
	            }
            },
            title: {
                text: 'Daily Steps'
            },
            xAxis: {
                categories: days
            },
            yAxis: {
                title: {
                    text: 'Steps'
                }
            },
            series: stepsData
        });
    });
}

if ( 0 && exists('#team_avg_steps') ){
    var chart2;
    $(document).ready(function () {
        chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'team_avg_steps',
                type: 'line',
                inverted: false
            },
            title: {
                text: 'Team Total: Average Steps Per Day'
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: 'Steps'
                }
            },
            series: getTeamDaily('avg_steps')
        });
    });
}

if ( 1 && exists('#profile_steps_goal') ){
   var profile_steps_goal;
   
    $(document).ready(function () {
        chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'profile_steps_goal',
                type: 'spline',
                inverted: false
            },
            title: {
                text: null
            },
			legend: {
				enabled: false,
			},
            yAxis: {
                title: {
                    text: 'Steps'
                }
            },
            series: getUserStepsGoal( window.localStorage.getItem('selectedUserID') ),
			plotOptions: {
	            series: {
	                lineWidth: 2,
					shadow: true,
	                marker: {
	                    enabled: false
	                },
		            enableMouseTracking: false,
	            }
            },

        });
    });
}