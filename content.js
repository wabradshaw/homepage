var baseUrl = "http://54.191.146.40:8080/travel-history/";

function getLatestBlogPost(){
	$.get(baseUrl + "blog/latest", function(data){
		$('#latest-blog-post').attr('href', data.url);
		$('#latest-blog-post').text(data.name);
	})
}

function getCurrentLocation(){
	$.get(baseUrl + "history/current", function(data){
		$('#location-map').attr('href', data.mapUrl);
		$('#location-map > img').attr('src', data.mapUrl);
		
		$('#location-name').text(data.name);	
		$('#location-country').text(data.country);
		
		if(data.timezone >= 0){
			$('#location-timezone').text("UTC +" +data.timezone);
		} else {
			$('#location-timezone').text("UTC " +data.timezone);
		}
	})
}

$(function(){
	getLatestBlogPost();
	getCurrentLocation();
})