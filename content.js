var baseUrl = "http://localhost:8080/travel-history/";

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
 * April 21st - 28th
 * April 21st - May 2nd
 */
function getCombinedTimestamp(startDate, endDate) {
	if(endDate == null){
		return asOrdinal(startDate) + " onwards";
	} else if(startDate.monthOfYear == endDate.monthOfYear) {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + asOrdinal(endDate.dayOfMonth);
	} else {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + months[endDate.monthOfYear] + " " + asOrdinal(endDate.dayOfMonth);
	}		
}

/**
 * Knockout Data class for a single trip.
 */
function Trip(name, country, startDate, endDate, timezone, blog, mapUrl){
	var self = this;
	
	self.name = name;
	self.country = country;
	self.startPoint = startDate.millis;
	self.timezone = timezone >= 0 ? "+" + timezone : timezone;
	self.combinedTimestamp = getCombinedTimestamp(startDate, endDate);
	self.blog = blog != null ? new Blog(blog.name, blog.url) : null;
	self.mapUrl = mapUrl;
}

/**
 * Knockout Data class for a blog.
 */
function Blog(name, url){
	var self = this;
	self.name = name;
	self.url = url;
}

/**
 * Main Knockout view model containing the trip history.
 */
function ContentViewModel(){
	var self = this;
	
	self.mode = ko.observable('default');
	self.latestBlog = ko.observable();
	self.currentTrip = ko.observable();
	self.trips = ko.observableArray([]);
	
	self.showDefault = function(){
		self.mode('default');
	}
		
	self.showLocationHistory = function(){
		self.mode('history');
	}
	
	$.get(baseUrl + "history/current", function(data){
		self.currentTrip(new Trip(data.name, data.country, data.startTime, data.endTime, data.timezone, data.blog, data.mapUrl));
	})
	
	$.get(baseUrl + "blog/latest", function(data){
		self.latestBlog(new Blog(data.name, data.url));
	})
	
	$.get(baseUrl + "history", function(data){
		self.trips($.map(data, function(item){
			return new Trip(item.name, item.country, item.startTime, item.endTime, item.timezone, item.blog, item.mapUrl);
		}).sort(function(a, b) {
			return b.startPoint - a.startPoint;
		}));
	})
}

/**
 * Register the ContentViewModel.
 */
$( document ).ready(function() {
	ko.applyBindings(new ContentViewModel());
});