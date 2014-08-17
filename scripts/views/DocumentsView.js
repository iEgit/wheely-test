var B = require('backbone'),
	FieldsetView = require('./FieldsetView.js'),
	$ = require('jquery'),
	_ = require('underscore'),
	RegistrationView = require('./RegistrationView.js');


var DocumentView = B.View.extend({
	tagName: 'div',
	className: 'col-md-4 document-image',
	events: {
		'click button': 'onClick'
	},
	onClick: function ($evt) {
		console.log('this');
		this.$el.remove()
	},
	render: function (url) {
		this.$el.html('<img src="' + url + '"/> <button type="button" class="remove">remove</button>')
		return this;
	}
});

function renderInto ($el) {
	return function (url) {
		console.log(url);
		new DocumentView().render(url).$el.appendTo($el);
	}
}

module.exports = RegistrationView.extend({
	tagName: 'div',
	className: 'row',
	render: function () {
		var that = this;
		this.$el.html('<legend>Your documents</legend>')
		$.ajax({
			url: '/documents',
			method: 'GET',
			success: function (response) {
				JSON.parse(response).forEach(renderInto(that.$el))
			}
		})
		return this;
	}
});