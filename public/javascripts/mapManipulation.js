//jQuery(document).ready(createMap);


var createMap = function(){
	map = new GMaps({
	  div: '#mapContainer',
	  zoom: 16,
	  lat: 31.978467043996375,
	  lng: 35.890319645404816,
	  click: function(e) {
	    alert('click');
	  },
	  dragend: function(e) {
	    alert('dragend');
	  }
	});
};