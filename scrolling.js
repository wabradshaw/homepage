var scrollController = new ScrollMagic.Controller();

function addTravelsScene(){
	var travelsScene = new ScrollMagic.Scene({
											triggerElement: "#locations-wrapper",
											triggerHook: "onCenter"
										})
										.setClassToggle(".location", "focused")
										.reverse(true);
	scrollController.addScene(travelsScene);
}

scrollController.scrollTo(function (pos) {
	TweenLite.to(window, 0.5, {scrollTo: {y: pos}});
});

$(document).on("click", ".banner a[href^='#']", function(e){
	var id = $(this).attr("href");
	if($(id).length > 0){		
		e.preventDefault();
		scrollController.scrollTo(id);
	}	
});

$( document ).ready(function() {

	var headerlessScene = new ScrollMagic.Scene({
											triggerElement: "#projects-wrapper",
											triggerHook: 0.9
										})
										.setClassToggle("#header", "fade")
										.reverse(true);
	scrollController.addScene(headerlessScene);
	
	var projectsScene = new ScrollMagic.Scene({
											triggerElement: "#projects-wrapper",
											triggerHook: "onLeave",
											offset: -200,
											duration: $("#projects-wrapper").height() - 400
										})
										.setClassToggle(".project", "focused")
										.reverse(true);
	scrollController.addScene(projectsScene);
	
	var aboutScene = new ScrollMagic.Scene({
											triggerElement: "#about-me-wrapper",
											triggerHook: "onLeave",
											offset: -400,
											duration: $("#about-me-wrapper").height() + 200
										})
										.setClassToggle("#about-me-wrapper", "focused")
										.reverse(true);
	scrollController.addScene(aboutScene);
});