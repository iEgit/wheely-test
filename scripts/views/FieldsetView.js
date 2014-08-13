var B = require('backbone'),
	InputView = require('./InputView.js'),
	_ = require('underscore'),
	$ = require('jquery');

var template = '<legend>{{name}}</legend>'

function direction (fromObj, toObj) {
	
}

module.exports = B.View.extend({
	tagName: 'fieldset',
	initialize: function (options) {
		this.name = options.name;
		this.index = options.index;
		this.parentView = options.parentView;

		var inputs = [];
		var that = this;

		options.inputs.forEach(function (input) {
			var v = new InputView({inputName: input});
			v.on('invalid', function () {
				// console.log(that.parentView);
				that.parentView.onNavClick({target: $('a[data-fs-index="' + that.index + '"]')});
			})
			inputs.push(v);
		});

		this.inputs = inputs;
	},
	render: function () {
		this.inputs.forEach(function (inputView) {
			inputView.render().$el.appendTo(this.$el);
		}, this);

	if (this.index === 3) this.$el.append('<button type=button class="btn btn-primary submit-button">submit</button>')
		return this;
	},
	insertNavItem: function ($nav) {
		this.$li = $('<li>')
					.html('<a data-fs-index="' + this.index +'">' + this.name + '</a>')
					.appendTo($nav);
	},
	go: function (direction) {
		this.$el.addClass('go' + direction).removeClass('active');
		return this;
	},
	show: function () {
		this.$el.removeClass('goright goleft').addClass('active');
		return this;
	},
	validate: function () {
		return this.inputs.reduce(function (prev, next) {
			if (!prev) return;

			if (typeof prev === 'object')
				return prev.validate();

			return next.validate();
		}, this.inputs[0])
		
	}
});