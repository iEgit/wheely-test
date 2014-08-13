var B = require('backbone'),
	FieldsetView = require('./FieldsetView.js'),
	$ = require('jquery'),
	_ = require('underscore');


var fieldSets = [{
	name: 'General info',
	inputs: ['city', 'applicant']
}, {
	name: 'User info',
	inputs: ['name', 'phone', 'email', 'password']
}, {
	name: 'Car model',
	inputs: ['car']
}, {
	name: 'Company',
	inputs: ['vatNumber', 'name', {
		name: 'address',
		inputs: ['line1', 'line2', 'postalCode', 'city', 'countryCode']
	}]
}];

var _template = '<ul class="registration-nav"></ul> <div class="registration-form-container"><fieldset></fieldset></div>' 

module.exports = B.View.extend({
	tagName: 'form',
	className: 'registration-form',
	events: {
		'click .registration-nav a': 'onNavClick',
		'click .submit-button': 'onSubmit'
	},
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
		// if (!this.validate())
		// 	return;
		$.ajax({
			type: 'POST',
			url: '/register',
			data: {a: 'adsf'},
			success: function () {
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

		var fs,
			$container = this.$('div'),
			$nav = this.$('ul'),
			that = this;

		this.fieldSets = fieldSets.map(function (fs, index) {
			fs.index = index;
			fs.parentView = that;
			sibling = fs;

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