var baseUrl = "https://wabradshaw.com/travel-history/";

/**
 * Knockout Data class for a trip spanning multiple locations. Could group multiple sub-trips.
 */
function TripGroup(title, locations, mapName){
	var self = this;

	self.title = title;
	self.locations = ko.observableArray(locations);
	self.mapUrl = "./images/trips/" + mapName + ".png";
}

/**
 * Knockout Data class for a single location.
 */
function Location(uuid, name, country, mapName){
	var self = this;

	self.uuid = uuid;	
	self.name = name;
	self.country = country;
	self.mapUrl = "./images/maps/" + mapName + ".png";
}

/**
 * Main Knockout view model containing the trip history.
 */
function ContentViewModel(){
	var self = this;
	
	self.mode = ko.observable('default');
	self.tripGroups = ko.observableArray([]);
	self.locationsLoaded = ko.observable(false);
	
	self.showDefault = function(){
		self.mode('default');
	}
		
	self.showLocationHistory = function(){
		self.mode('history');
		$( "#history-wrapper" ).accordion({
			collapsible: true, 
			heightStyle: "content", 
			active: false,
			icons: false
		});
	}

	var trips = {};

	for (trip_name in locationData){		
		var trip_locations = locationData[trip_name].map(item => new Location(item.uuid, item.name, item.country, item.mapName));
		trips[trip_name] = trip_locations;
	}

	groupData.forEach(item => {
		locations = item["components"].flatMap(item => trips[item]);
		
		self.tripGroups.push(new TripGroup(item["title"], locations, item["mapName"]));
	});

	console.log(self.tripGroups());

	self.locationsLoaded(true);
	
	self.getTripLocations = function(targetName){		
		return self.trips().find( obj => { return obj.name == targetName}).locations;
	}
}

function toggleLocation(e){
	if(!$(e.target).is('.full-history *')){
		var loc = $(e.target).closest('.location');
		loc.find('.show-trip-button > i').toggleClass('flipped');
		loc.find('.expand-spacer').slideToggle('100');
		loc.find('.full-history').slideToggle('1000');
	}
}

/**
 * Register the ContentViewModel.
 */
$( document ).ready(function() {
	ko.applyBindings(new ContentViewModel());
	
	$('body').click(function(e){
		if(!$(e.target).is('.location') && !$(e.target).is('.location *')){
			$('.flipped').removeClass('flipped');
			$('.expand-spacer').slideUp('100');
			$('.full-history').slideUp('1000');
		}
	});
});
