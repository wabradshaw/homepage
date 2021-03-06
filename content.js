var baseUrl = "https://wabradshaw.com/travel-history/";

var months = ["December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Converts a day of the month into an ordinal (e.g. 1st, 2nd, 3rd).
 */
function asOrdinal(day){
	switch(day){
		case 1:
		case 21: 
		case 31:
			return day + "st";
			break;
		case 2: 
		case 22:
			return day + "nd";
			break;
		case 3: 
		case 23:
			return day + "rd";
			break;
		default:
			return day + "th";
			break;
	}
}

/**
 * Combines the startDate and endDate timestamps. Dates use one of three forms, based on relevant info:
 * April 21st onwards
 * April 21st - May 2nd
 * April 21st - 28th
 * Aprin 21st
 */
function getCombinedTimestamp(startDate, endDate) {
	if(endDate == null){
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " onwards";
	} else if(startDate.monthOfYear != endDate.monthOfYear) {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + months[endDate.monthOfYear] + " " + asOrdinal(endDate.dayOfMonth);
	} else if(startDate.dayOfMonth != endDate.dayOfMonth){
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + asOrdinal(endDate.dayOfMonth);	
	} else {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth);
	}	
}

/**
 *Knockout Data class for a trip spanning multiple locations.
 */
function Trip(name){
	var self = this;

	self.name = name;
	self.locations = ko.observableArray([]);
	
	self.addLocation = function(location){
		self.locations.push(location);
	}
}

/**
 * Knockout Data class for a single location.
 */
function Location(uuid, name, country, trip, startDate, endDate, timezone, blog, mapUrl){
	var self = this;

	self.uuid = uuid;	
	self.name = name;
	self.country = country;
	self.trip = trip;
	self.startPoint = startDate.millis;
	self.timezone = timezone >= 0 ? "+" + timezone : timezone;
	self.combinedTimestamp = getCombinedTimestamp(startDate, endDate);
	self.mapUrl = mapUrl;
}

/**
 * Main Knockout view model containing the trip history.
 */
function ContentViewModel(){
	var self = this;
	
	self.mode = ko.observable('default');
	self.currentLocation = ko.observable();
	self.trips = ko.observableArray([]);
	self.locations = ko.observableArray([]);
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
	
	$.get(baseUrl + "history/current", function(data){
		self.currentLocation(new Location(data.uuid, data.name, data.country, data.group, data.startTime, data.endTime, data.timezone, data.blog, data.mapUrl));
	})
		
	$.get(baseUrl + "history", function(data){
		self.locations($.map(data, function(item){
			return new Location(item.uuid, item.name, item.country, item.group, item.startTime, item.endTime, item.timezone, item.blog, item.mapUrl);
		}).sort(function(a, b) {
			return b.startPoint - a.startPoint;
		}));
		
		if(self.locations().length > 0){
			var currentTrip = new Trip(self.locations()[0].trip);
			$.each(self.locations(), function(index){
				var item = self.locations()[index];
				if(currentTrip.name != item.trip){
					self.trips.push(currentTrip);
					currentTrip = new Trip(item.trip);
				}
				currentTrip.addLocation(item);
			})
			self.trips.push(currentTrip);
		}
		
		self.locationsLoaded(true);
		addTravelsScene();
	})
	
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
