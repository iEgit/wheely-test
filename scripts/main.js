var Backbone = require('backbone'),
	$ = require('jquery'),
	_ = require('underscore'),
	bselect = require('bselect')($);


// hook for bootstrap since it requires global jQuery object
// also hooked bootstrap.js itself
window.jQuery = $;
bootstrap = require('./styles/bootstrap-3.2.0/dist/js/bootstrap.js');
window.jQuery = null;

// libs setup
require('jquery-ui/autocomplete');
require('./vendor/FancyText.js')($);
Backbone.$ = $;


var FieldsetView = require('./views/FieldsetView.js'),
	RegistrationView = require('./views/RegistrationView.js'),
	CabinetView = require('./views/CabinetView.js');


// setting a handlebars-like templates
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var _template = _.template.bind(_);

function onLoad (argument) {

	var	$container = $('#container');
	
	var registrationView = new RegistrationView().render();
	registrationView.render().$el.appendTo($container);

	setUpInputs();

	registrationView.on('registered', function () {
		var cabinetView = new CabinetView()
							.render()
							.hide();

		cabinetView.$el.appendTo($container);

		registrationView.hide(function () {
			cabinetView.show(function () {
				var $p = $('<p class="success-register bg-success">You have successfully registered</p>')
				$p.prependTo($container)
					.delay(2000)
					.animate({
						opacity: 0,
						height: 0
					})
			});
			setUpInputs();
			registrationView.remove();
		})
	})
	
}

function setUpInputs () {
	// init ftext and bselect here since it doesn't initializes properly 
	// without elements being in DOM
	$('input[type=text], input[type=password]').ftext();
	$('select').bselect({ searchInput : false });

	$('.tpeahead').each(function (index, el) {
		var $el = $(el);

		$.ajax({
			url: $el.attr('data-url'),
			type: 'GET',
			success: function (response) {
				$el.autocomplete({source: JSON.parse(response)});
			}
		})
	})
}

$(onLoad);
