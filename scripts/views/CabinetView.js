var B = require('backbone'),
	FieldsetView = require('./FieldsetView.js'),
	$ = require('jquery'),
	_ = require('underscore'),
	RegistrationView = require('./RegistrationView.js');


module.exports = RegistrationView.extend({
	className: 'cabinet-form',
	hide: function () {
		this.$el.css({
			opacity: 0,
			display: 'none'
		})
		return this;
	},
	show: function (cb) {
		
		this.$el.css({display: 'block'})
			.animate({
				opacity: 1
			}, {
				complete: cb || function () {}
			})

		return this;
	},
	render: function () {
		RegistrationView.prototype.render.call(this, '<div></div>');
		return this;
	}
});