var B = require('backbone'),
	FieldsetView = require('./FieldsetView.js'),
	$ = require('jquery'),
	_ = require('underscore'),
	user = require('../models/User');;

var fieldSets = [{
	name: 'General info',
	inputs: ['city', 'applicant']
}, {
	name: 'User info',
	inputs: ['name', 'phone', 'email', 'password']
}, {
	name: 'Car model',
	inputs: ['carModel']
}, {
	name: 'Company',
	inputs: ['vatNumber', 'companyName', {
		name: 'address',
		inputs: ['line1', 'line2', 'postalCode', 'companyCity', 'countryCode']
	}]
}];

var _template = '<ul class="registration-nav"></ul> <div class="registration-form-container"><fieldset></fieldset></div>',
	edit = false;

module.exports = B.View.extend({
	tagName: 'form',
	className: 'registration-form',
	events: {
		'click .registration-nav a': 'onNavClick',
		'click .submit-button': 'onSubmit'
	},
	edit: false,
	onNavClick: function ($evt) {
		var $target = $($evt.target),
			i = $target.attr('data-fs-index'),
			v = this.fieldSets[i],
			next = i > this.currentFs.index;

		this.currentFs.go(next ? 'left' : 'right');
		this.currentFs = this.fieldSets[i].show();
		$target
			.parent().addClass('active')
			.siblings().removeClass('active');
	},
	onSubmit: function ($evt) {
		var that = this

		if (!this.validate())
			// return
			console.log('this');

		this.fieldSets.forEach(function (fs) {
			fs.setToUser();
		});

		$.ajax({
			type: 'POST',
			url: '/register',
			data: user.toJSON(),
			success: function () {
				edit = true;
				that.trigger('registered', {});
			} 
		});

	},
	hide: function (cb) {
		this.$el.animate({
			opacity: 0
		}, {
			complete: function () {
				$(this).remove();
				cb && cb();
			}
		})
	},
	render: function (template) {
		this.$el.html(template || _template);

		var $container = this.$('div'),
			$nav = this.$('ul'),
			that = this;

		this.fieldSets = fieldSets.map(function (fs, index) {
			fs.index = index;
			fs.parentView = that;
			fs.edit = edit;

			var v = new FieldsetView(fs).render();
			v.$el.appendTo($container);
			v.insertNavItem($nav);

			if (fs.index > 0 && !template) v.go('right');
			return v;
		});

		this.currentFs = this.fieldSets[0];

		return this;
	},
	validate: function () {

		return this.fieldSets.reduce(function (prev, next) {

			if (typeof prev === 'object')
				return prev.validate();

			return prev && next.validate();
		}, this.fieldSets[0])
	}
});