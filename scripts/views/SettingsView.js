var B = require('backbone'),
	$ = require('jquery');

module.exports = B.View.extend({
	tagName: 'div',
	className: 'settings',
	initialize: function () {
		this.toggled = false;
		return this;
	},
	onClick: function ($evt) {
		var that = this,
			$button = $($evt.target).addClass('wait');
		$.ajax({
			url: '/latency',
			type: 'GET',
			data: {latency: +(!that.toggled)},
			success: function () {
				console.log('success');
				$button.toggleClass('low-latency');
				that.toggled = !that.toggled;
				$button.one('click', that.onClick.bind(that))
			},
			complete: function () {
				$button.removeClass('wait');
			}
		})		
	},
	render: function () {
		var $button = $('<button type="button" class="btn btn-info">Latency</button>');
		this.$el.append($button)

		$button.one('click', this.onClick.bind(this))
		return this;
	}
})