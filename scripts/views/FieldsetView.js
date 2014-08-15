var B = require('backbone'),
	InputView = require('./InputView.js'),
	_ = require('underscore'),
	$ = require('jquery');

var template = '<legend>{{name}}</legend>'

var FSview = module.exports = B.View.extend({
	tagName: 'fieldset',
	initialize: function (options) {
		this.options = options;
		this.parentView = options.parentView;

		var inputs = [];
		var that = this;

		options.inputs.forEach(function (input) {
			var v = typeof input === 'object' ? new FSview (_.extend(input, {edit: options.edit})) : new InputView({inputName: input, edit: options.edit});
			v.on('invalid', function () {
				that.parentView.onNavClick({target: $('a[data-fs-index="' + options.index + '"]')});
			})
			inputs.push(v);
		});

		this.inputs = inputs;
	},
	render: function () {
		this.$el.html(_.template(template)(this.options))
		this.inputs.forEach(function (inputView) {
			inputView.render().$el.appendTo(this.$el);
		}, this);

		if (this.options.index === 3) this.$el.append('<button type=button class="btn btn-primary submit-button">submit</button>')

		return this;
	},
	insertNavItem: function ($nav) {
		this.$li = $('<li class="' + (this.options.index === 0 ? 'active': '') +  '">')
					.html('<a data-fs-index="' + this.options.index +'">' + this.options.name + '</a>')
					.appendTo($nav);
	},
	go: function (direction) {
		this.$el.addClass('go' + direction);
		return this;
	},
	show: function () {
		this.$el.removeClass('goright goleft');
		return this;
	},
	validate: function () {
		return this.inputs.reduce(function (prev, next) {
			if (!prev) return;

			if (typeof prev === 'object')
				return prev.validate();

			return next.validate();
		}, this.inputs[0])
		
	},
	setToUser: function () {
		this.inputs.forEach(function (input) {
			input.setToUser();
		})
	}
});