//jQuery(document).ready(createMap);


var createMap = function(){
	map = new GMaps({
	  div: '#mapContainer',
	  zoom: 16,
	  lat: 31.978467043996375,
	  lng: 35.890319645404816
	});
};





jQuery(document).ready(function(){
	// male it on button click
	createMap();

	mapClick();
	editPoint();
	onAddMarker();

	//for hadling user.
	initUser();
});


var mapClick = function(){
	GMaps.on('click',map.map, function(e){
		var index = map.markers.length;
	    var lat = e.latLng.lat();
	    var lng = e.latLng.lng();

	    var template = $('#edit_marker_template').text();

	    var content = template.replace(/{{index}}/g, index).replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);

	    map.addMarker({
	      lat: lat,
	      lng: lng,
	      title: 'Marker #' + index,
	      infoWindow: {
	        content : content
	      }
	    });
  });
}



var editPoint = function(){
	$(document).on('submit', '.edit_marker', function(e) {
		e.preventDefault();

		var $index = $(this).data('marker-index');

		$lat = $('#marker_' + $index + '_lat').val();
		$lng = $('#marker_' + $index + '_lng').val();

		var template = $('#edit_marker_template').text();

		// Update form values
		var content = template.replace(/{{index}}/g, $index).replace(/{{lat}}/g, $lat).replace(/{{lng}}/g, $lng);

		map.markers[$index].setPosition(new google.maps.LatLng($lat, $lng));
		map.markers[$index].infoWindow.setContent(content);

		$marker = $('#markers-with-coordinates').find('li').eq(0).find('a');
		$marker.data('marker-lat', $lat);
		$marker.data('marker-lng', $lng);
	});
}


var onAddMarker = function(){
	GMaps.on('marker_added', map, function(marker) {
    	$('#markers-with-index').append('<li><a href="#" class="pan-to-marker" data-marker-index="' + map.markers.indexOf(marker) + '">' + marker.title + '</a></li>');
    	$('#markers-with-coordinates').append('<li><a href="#" class="pan-to-marker" data-marker-lat="' + marker.getPosition().lat() + '" data-marker-lng="' + marker.getPosition().lng() + '">' + marker.title + '</a></li>');
  });
}



var initUser = function(){
	var token = JSON.parse(storage.fetchItem("token")),
		user = JSON.parse(storage.fetchItem("user")),
		user_type = storage.fetchItem("user_type");

	switch(user_type){
		case "1":
			jQuery("body").prepend(jQuery("<h1>").html("Parent APP"));
			parent.init();
			break;
		case "2":
			jQuery("body").prepend(jQuery("<h1>").html("Student APP"));
			break;
		case "3":
			jQuery("body").prepend(jQuery("<h1>").html("Bus APP"));
			bus.init();
			break;
		case "4":
			jQuery("body").prepend(jQuery("<h1>").html("school APP"));
			school.init();
			break;
	}
}