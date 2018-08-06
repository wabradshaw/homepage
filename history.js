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
		return asDate(startDate) + " onwards";
	} else if(startDate.monthOfYear == endDate.monthOfYear) {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + asOrdinal(endDate.dayOfMonth);
	} else {
		return months[startDate.monthOfYear] + " " + asOrdinal(startDate.dayOfMonth) + " - " + months[endDate.monthOfYear] + " " + asOrdinal(endDate.dayOfMonth);
	}		
}

/**
 * A single trip.
 */
function Trip(name, country, startDate, endDate, blog, mapUrl){
	var self = this;
	
	self.name = name;
	self.country = country;
	self.startPoint = startDate.millis;
	self.combinedTimestamp = getCombinedTimestamp(startDate, endDate);
	self.blogUrl = blog != null ? blog.url : null;
	self.blogName = blog != null ? blog.name : null;
	self.mapUrl = mapUrl;
}

/**
 * Main Knockout view model containing the trip history.
 */
function HistoryViewModel(){
	var self = this;
	
	self.trips = ko.observableArray([]);
	
	$.get(baseUrl + "history", function(data){
		console.log(data);
		self.trips($.map(data, function(item){
			return new Trip(item.name, item.country, item.startTime, item.endTime, item.blog, item.mapUrl);
		}).sort(function(a, b) {
			return b.startPoint - a.startPoint;
		}));
	})
}

/**
 * Register the HistoryViewModel.
 */
$( document ).ready(function() {
	ko.applyBindings(new HistoryViewModel());
});