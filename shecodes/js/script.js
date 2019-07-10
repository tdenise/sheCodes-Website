$(document).ready(function(){

	var topoffset=30
	var width = $(window).width(); //height of window

	webshim.activeLang('en');
    webshims.polyfill('forms');
	var userExists = false;

	//Activate Scrollspy
	$('body').scrollspy({target: '.navbar', offset: 100});

	//Use smooth scrolling when clicking on navigation
	$('.navbar a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') === 
			this.pathname.replace(/^\//,'') && 
			location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top-topoffset
		        }, 500);
		    	return false;
			} //target.length
	    } //click function
	}); //smooth scrolling)

	// EMAIL SUBMISSION
	$('#email-form').submit(function(event) {
		event.preventDefault();
		data = {"email": $('input[name="email"]').val()};

		//ajax call to /subscribe post route 
		$.post('/subscribe', data).done(function(response){
			if (response == "exists") {
				$("#email-help").show();
			}

			//TODO: add cases for error 
			if (response == "success") {
				$("#email-form").hide();
				$("#email-help").hide();
				$("#email-success-message").show();
			}
		})
	});

	// APPLICATION SUBMISSION
	$("#gender").prop("selectedIndex", -1);
	$("#level").prop("selectedIndex", -1);
	$("#tshirt").prop("selectedIndex", -1);
	$("#interests").prop("selectedIndex", -1);
	$('#application-form').submit(function(e) {
		
		$('.form-group').removeClass('has-error');
		var validForm = true;

		// useful values
		var year = $("#year").val();
		var passLength = $('#password').val().length;
		var storyOfYouLength = $('#story-of-you').val().length;
		var rawPhone = getPhoneNumber($("#phone").val());

		// username exists
		if (userExists) {
			invalidateOn("#username");
		}

		// password not between 8-100 chars
		else if (passLength < 8 || passLength > 100){
			invalidateOn("#password");
		}

		// passwords don't match
		else if($('#password').val()!=$('#password-repeat').val()){
			invalidateOn("#password-repeat");
		}

		// phone number not valid
		else if (rawPhone.length != 10 && rawPhone.length != 11){
			invalidateOn("#phone");
		}

		// year is out of range
		// TODO: rewrite this like someone with a brain would
		else if ( !(year == "2016" || year == "2017" || year == "2018" || year == "2019" 
			|| year == "2020" || year == "2021" || year == "2022") ) {
			invalidateOn("#year");
		}

		// 'story of you' too long
		else if (storyOfYouLength > 140) {
			invalidateOn("#story-of-you");
		}

		// resume is over 10mb
		else if ($("#resume").prop('files')[0].size >= 10000000) {
			invalidateOn("#resume");
		}

		console.log();

		function getPhoneNumber(text) {
			var sd = text.replace(/[^0-9]/gi, '');
			return parseInt(sd, 10).toString();
		}

		// function displays error message and scrolls up
		// to bad field
		function invalidateOn(offenderTag) {
			e.preventDefault();
			$(offenderTag).parent().addClass('has-error');
			var targetOffset= $(offenderTag).parent().offset().top;
			$('html, body').animate({scrollTop: targetOffset-100}, 750);
			validForm = false;
		}
		
	});

	// check email exists every 300ms
	$("#username").change(function(){
		var data = {"email": $('input[name="username"]').val()};
		$.post('/check_email_exists', data).done(function(response){
			if (response == "exists") {
				userExists = true;
			} else {
				userExists = false;
			}
		});
	});

	// check if email exists from email-checker page
	$('#email-checker-form').submit(function(event) {
		event.preventDefault();
		email = $('#username').val();

		//ajax call to /check_email_exists post route 
		data = {"email": email};
		$.post('/check_email_exists', data).done(function(response){
			if (response == "exists") {
				$("#message").text(email+' has submitted an application')
				$("#message").css({"color":"green"})
			} else {
				$("#message").text(email+' has not submitted an application')
				$("#message").css({"color":"red"})
			}
			console.log(response);
			$("#message").show();
		});
	});

	
});