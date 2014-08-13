var B = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery');

var text = function (opts) {
	opts = opts || {};
	return _.extend({
		type: 'text',
		label: 'enter'
	}, opts);
},
	selectable = function (opts) {
		opts = opts || {};
		return _.extend({
			type: 'selectable',
			label: 'select'
		}, opts);		
	},
	text_ = text();

function length (l) {
	return new RegExp('.{' + l + '}')
}

var fieldsHash = {
    city: text({
    	autocomplete: '/cities'
    }),
    applicant: selectable({
    	options: 'driver,company'
    }),
    // user: {
        name: text(),
        phone: text({
        	re: /.{14}/
        }),
        email: text({
        	re: /.{3}/
        }),
        password: text({

        	re: length(4)
        }),
    // },
    car_model: text({
    	mask: 'Type the model of your car model',
    	re: length(1)
    }),
    // company: {
        vatNumber: text({
        	mask: 'Type the vat number',
        	re: length(10)
        }),
        name: text(),
        // address: {
            line1: text_,
            line2: text_,
            postalCode: text_,
            // city: text_,
            countryCode: selectable()
        // }
    // }
}

module.exports = B.View.extend({
	tagName: 'input',
	className: 'fancy-textbox masked form-control',
	events: {
		'focusin': 'onFocusin',
		'focusout': 'onFocusout'
	},
	initialize: function (opts) {
		var options = this.options = fieldsHash[opts.inputName] || {};
		if (options.type === 'selectable') {
			var $el = this.$el = $('<select></select>');

			options.options.split(',').forEach(function (o) {
				$el.append('<option>' + o)
			})
		}

		this.re = options.re;
		this.mask = options.mask || 'your ' + opts.inputName;
		this.$el.attr({
			type: options.type || 'text',
			'data-animation': options.animation || 'slide',
			'data-label': options.label || 'Enter',
			'data-mask': this.mask
		})

	},
	onFocusin: function () {
		function handler () {
			if (this.validate()) this.$el.parent().removeClass('has-error')
		}
		this.$el.on('input', handler.bind(this));
	},
	onFocusout: function () {
		this.$el.off('input', this.handler)
	},
	render: function () {
		if (this.options.autocomplete) 
			this.$el.addClass('tpeahead').attr('data-url', this.options.autocomplete)
		return this;
	},
	validate: function () {
		if (this.$el.val() === this.mask) {
			this.trigger('invalid');
			this.$el.parent().addClass('has-error')
			return false;
		}
		return true;
	},
	check: function () {
		return this.$el.val() !== this.mask && this.re.test(this.el.val());
	}
});