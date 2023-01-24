$(".building-simple").on('click', function(){

    $(".child-building-purpose").prop('checked', $(this).is(":checked")).trigger('change');
    $(".building-class").prop('checked', $(this).is(":checked")).trigger('change');
    buildingShow($(".building-simple").is(":checked"));
});
$(".building-department").on('change', function(){

    $(".child-department-type").prop('checked', $(this).is(":checked")).trigger('change');
    buildingShow($(".building-simple").is(":checked"));
});

$(".building-purpose").on('change', function(){

    $(".child-building-purpose").prop('checked', $(this).is(":checked")).trigger('change');
    buildingShow($(".building-simple").is(":checked"));
});
$(".switch-all").on('click', function(){
    var type = $(this).data('type');

    $(".child-"+type).prop('checked', $(this).is(":checked")).trigger('change');
    $(".child-building-purpose").prop('checked', $(this).is(":checked")).trigger('change');
    buildingShow($(".building-simple").is(":checked"));
});
$(".layer-shower").on('click', function(){
    if(!$(this).is(":checked"))
    {
        var checkedVals2 = $('.child-building-purpose:checkbox:checked').map(function() {
            return this.value;
        }).get();

        if(checkedVals2.length == 0)
        {
            $(".building-simple").prop('checked', false).trigger('change')
        }
        buildingShow($(".building-simple").is(":checked"));
    }
    else
    {
        if(!$(".building-simple").is(":checked"))
        {
            $(".building-simple").prop('checked', true).trigger('change');
        }
        buildingShow($(".building-simple").is(":checked"));
    }
    
});
$(".building-uddt").on('change', function(){
    buildingUddtShow($(this).is(":checked"));
});
$(".unit-level-1").on('change', function() {
    var aimagCode = $(this).val();
    $("#level2_div").val(null).trigger('change');
    $("#level3_div").val(null).trigger('change');

    map.removeLayer(currentSoumLayer);
    currentSoumLayer = null;
    map.removeLayer(currentAimagLayer);
    currentAimagLayer = null;
    map.removeLayer(currentBagLayer);
    currentBagLayer = null;
    if(aimagCode){
        $.ajax({
            url: "/au1/by/id",
            type: 'post',
            // dataType: 'json',
            data: {
                auLevel1Code: aimagCode
            },
            beforeSend: function() {
    
            },
            success: function(response) {
                if(response.geom){
                    addSelectedAimagLayerToMap(map, 'selectedAimag', geoware, response.geom)
                }
                else{
                        return null;
                }
            },
            error: function(xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: false,
        }).done(function(data) {})
        buildingShow($(".building-simple").is(":checked"));
        buildingUddtShow($(".building-uddt").is(":checked"));
    }
})
$(".unit-level-2").on('change', function() {
    var soumCode = $(this).val();
    // buildingInfo();
    // buildingInfoGraphic();
    $("#level3_div").val(null).trigger('change');
    map.removeLayer(currentSoumLayer);
    currentSoumLayer = null;
    map.removeLayer(currentBagLayer);
    currentBagLayer = null;
    if(soumCode)
    {
        $.ajax({
            url: "/au2/by/id",
            type: 'post',
            // dataType: 'json',
            data: {
                auLevel2Code: soumCode
            },
            beforeSend: function() {
    
            },
            success: function(response) {
                addSelectedSoumLayerToMap(map, 'selectedSoum', geoware, response.geom)
            },
            error: function(xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: false,
        }).done(function(data) {});
        buildingShow($(".building-simple").is(":checked"));
        buildingUddtShow($(".building-uddt").is(":checked"));
    }
})
$(".unit-level-3").on('change', function() {
    var bagCode = $(this).val();
    // buildingInfo();
    // buildingInfoGraphic();
    map.removeLayer(currentBagLayer);
    currentBagLayer = null;
    if(bagCode){
        $.ajax({
            url: "/au3/by/id",
            type: 'post',
            // dataType: 'json',
            data: {
                auLevel3Code: bagCode
            },
            beforeSend: function() {
    
            },
            success: function(response) {
                console.log(response)
                addSelectedBagLayerToMap(map, 'selectedBag', geoware, response.geom)
            },
            error: function(xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: false,
        }).done(function(data) {});
        buildingShow($(".building-simple").is(":checked"));
        buildingUddtShow($(".building-uddt").is(":checked"));
    }
});





		// import WebGLPointsLayer from 'ol/layer/WebGLPoints';

		// const vectorSource = new Vector({
		// attributions: 'NASA',
		// });

		// const oldColor = 'rgba(242,56,22,0.61)';
		// const newColor = '#ffe52c';
		// const period = 12; // animation period in seconds
		// const animRatio = [
		// '^',
		// [
		// 	'/',
		// 	[
		// 	'%',
		// 	[
		// 		'+',
		// 		['time'],
		// 		['interpolate', ['linear'], ['get', 'year'], 1850, 0, 2015, period],
		// 	],
		// 	period,
		// 	],
		// 	period,
		// ],
		// 0.5,
		// ];

		// const style = {
		// variables: {
		// 	minYear: 1850,
		// 	maxYear: 2015,
		// },
		// filter: ['between', ['get', 'year'], ['var', 'minYear'], ['var', 'maxYear']],
		// symbol: {
		// 	symbolType: 'circle',
		// 	size: [
		// 	'*',
		// 	['interpolate', ['linear'], ['get', 'mass'], 0, 8, 200000, 26],
		// 	['-', 1.75, ['*', animRatio, 0.75]],
		// 	],
		// 	color: ['interpolate', ['linear'], animRatio, 0, newColor, 1, oldColor],
		// 	opacity: ['-', 1.0, ['*', animRatio, 0.75]],
		// },
		// };

		// // handle input values & events
		// const minYearInput = document.getElementById('min-year');
		// const maxYearInput = document.getElementById('max-year');

		// function updateMinYear() {
		// style.variables.minYear = parseInt(minYearInput.value);
		// updateStatusText();
		// }
		// function updateMaxYear() {
		// style.variables.maxYear = parseInt(maxYearInput.value);
		// updateStatusText();
		// }
		// function updateStatusText() {
		// const div = document.getElementById('status');
		// div.querySelector('span.min-year').textContent = minYearInput.value;
		// div.querySelector('span.max-year').textContent = maxYearInput.value;
		// }

		// minYearInput.addEventListener('input', updateMinYear);
		// minYearInput.addEventListener('change', updateMinYear);
		// maxYearInput.addEventListener('input', updateMaxYear);
		// maxYearInput.addEventListener('change', updateMaxYear);
		// updateStatusText();

		// // load data
		// const client = new XMLHttpRequest();
		// client.open('GET', 'data/csv/meteorite_landings.csv');
		// client.onload = function () {
		// const csv = client.responseText;
		// const features = [];

		// let prevIndex = csv.indexOf('\n') + 1; // scan past the header line

		// let curIndex;
		// while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
		// 	const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
		// 	prevIndex = curIndex + 1;

		// 	const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
		// 	if (isNaN(coords[0]) || isNaN(coords[1])) {
		// 	// guard against bad data
		// 	continue;
		// 	}

		// 	features.push(
		// 	new Feature({
		// 		mass: parseFloat(line[1]) || 0,
		// 		year: parseInt(line[2]) || 0,
		// 		geometry: new Point(coords),
		// 	})
		// 	);
		// }

		// vectorSource.addFeatures(features);
		// };
		// client.send();

		// const map = new Map({
		// layers: [
		// 	new TileLayer({
		// 	source: new Stamen({
		// 		layer: 'toner',
		// 	}),
		// 	}),
		// 	new WebGLPointsLayer({
		// 	style: style,
		// 	source: vectorSource,
		// 	disableHitDetection: true,
		// 	}),
		// ],
		// target: document.getElementById('map'),
		// view: new View({
		// 	center: [0, 0],
		// 	zoom: 2,
		// }),
		// });

		// // animate the map
		// function animate() {
		// map.render();
		// window.requestAnimationFrame(animate);
		// }
		// animate();

		
	