var B = require('backbone'),
	FieldsetView = require('./FieldsetView.js'),
	$ = require('jquery'),
	_ = require('underscore'),
	RegistrationView = require('./RegistrationView.js'),
	DocumentsView = require('./DocumentsView.js'),
	user = require('../models/User.js');

var fieldSets = require('../models/fieldsets.json');

module.exports = RegistrationView.extend({
	className: 'cabinet-form',
	initialize: function () {
		this.documentsView = new DocumentsView();
	},
	submit: function () {
		var template = _.template($('#modal-template').html()),
			$body = $('body'),
			$modal = $('<div class="modal">').css('display', 'none').appendTo($body)


		$.ajax({
			url: '/edit',
			type: 'POST',
			data: user.toJSON(),
			success: function () {
				showModal({body: 'changes have been saved',
					className: 'success'
			});
			},
			error: function () {
				showModal({body: 'changes have not been saved',
					className: 'error'
			});
			}
		})

		function showModal (options) {
			$modal.html(template(options)).show({
				duration: 300,
				complete: function (argument) {
					setTimeout($modal.hide.bind($modal, 300), 1000)
				}
			})
		}
	},
	hide: function () {
		this.$el.css({
			opacity: 0,
			display: 'none'
		})
		return this;
	},
	show: function (cb) {
		this.undelegateEvents();
		this.$('button').on('click', this.submit)

		$('#myModal').modal()
		this.$el.css({display: 'block'})
			.animate({
				opacity: 1
			}, {
				complete: cb || function () {}
			})

		return this;
	},
	render: function () {
		var $el = this.$el;

		this.fieldSets = fieldSets.map(function (fs, index) {
			fs.edit = true;

			var v = new FieldsetView(fs).render();
			v.$el.appendTo($el);

			return v;
		});

		this.documentsView.render().$el.appendTo($el);

		return this;
	}
});