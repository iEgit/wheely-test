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
			data: {latency: +!this.toggled},
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
		var $button = $('<button type="button" class="btn btn-info">Latency</button>').hide(),
			that = this;
		this.$el.append($button)


		$.ajax({
			url: '/latencyStatus',
			type: 'GET',
			success: function (response) {

				that.toggled = Boolean(+response)
				$button.one('click', that.onClick.bind(that)).
					addClass(+response ? 'low-latency' : '').
					show(300)
			}
		})
		
		return this;
	}
})