/*$.getJSON('airports.json', function(data) {
	console.log(data);

});
*/
var lat1, lon1, lat2, lon2;
$(function CalcDist() {

	$("#origin-input").autocomplete({
		source: function (request, response) {
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i");
			$.ajax({
				url: "airports.json",
				dataType: "json",
				success: function (data) {
					response($.map(data.airports, function(v, i) {
						var text1 = v.name;
						lon1 = v.lon
						lat1 = v.lat

						if ( text1 && ( !request.term || matcher.test(text1))) {
							return {
								label: v.name,
								value: v.name,
		
							};
						}

					}));
				}
			});
		}
	});

	$("#destination-input").autocomplete({
		source: function (request, response) {
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i");
			$.ajax({
				url: "airports.json",
				dataType: "json",
				success: function (data) {
					response($.map(data.airports, function(v, i) {
						var text2 = v.name;
						lon2 = v.lon
						lat2 = v.lat
						if ( text2 && ( !request.term || matcher.test(text2))) {
							return {
								label: v.name,
								value: v.lon,
								longitude2,
								latitude2
							};
						}
					}));
				}
			});
		}
	});
	

});

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


//var text1, text2, longitude1, longitude2, latitude1, latitude2;

function initMap() {
  var bounds = new google.maps.LatLngBounds;
  var markersArray = [];

  var origin1 = {lat: 55.93, lng: -3.118};
  var origin2 = 'Greenwich, England';
  var destinationA = 'Stockholm, Sweden';
  var destinationB = {lat: 50.087, lng: 14.421};

  var destinationIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=D|FF0000|000000';
  var originIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=O|FFFF00|000000';
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.53, lng: 9.4},
    zoom: 10
  });
  var geocoder = new google.maps.Geocoder;

  var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';
      deleteMarkers(markersArray);

      var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            }));
          } else {
            alert('Geocode was not successful due to: ' + status);
          }
        };
      };

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        geocoder.geocode({'address': originList[i]},
            showGeocodedAddressOnMap(false));
        for (var j = 0; j < results.length; j++) {
          geocoder.geocode({'address': destinationList[j]},
              showGeocodedAddressOnMap(true));
          outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
              ': ' + results[j].distance.text + ' in ' +
              results[j].duration.text + '<br>';
        }
      }
    }
  });
}


function deleteMarkers(markersArray) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

