var B = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	user = require('../models/User');

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
        	re: /^\d\s?(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/
        }),
        email: text({
        	re: /^((?:(?:(?:[a-zA-Z0-9][\.\-\+_]?)*)[a-zA-Z0-9])+)\@((?:(?:(?:[a-zA-Z0-9][\.\-_]?){0,62})[a-zA-Z0-9])+)\.([a-zA-Z0-9]{2,6})$/
        }),
        password: text({
        	type: 'password',
        	re: length(4)
        }),
    // },
    carModel: text({
    	mask: 'Type the model of your car model',
    	re: length(1)
    }),
    // company: {
        vatNumber: text({
        	mask: 'Type the vat number',
        	re: length(5)
        }),
        companyName: text({
        	mask: 'your company name'
        }),
        // address: {
            line1: text({
            	mask: 'street'
            }),
            line2: text({
            	mask: 'building number'
            }),
            postalCode: text({
            	mask: 'postal code'
            }),
            companyCity: text(),
            countryCode: selectable({
            	options: 'Russia,USA,UK,Spain'
            })
        // }
    // }
}

module.exports = B.View.extend({
	tagName: 'input',
	className: 'fancy-textbox masked form-control',
	initialize: function (opts) {
		
		var options = this.options = fieldsHash[opts.inputName] || {};
		options.name = opts.inputName;

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
			'data-label': opts.edit ? 'Edit' : 'Enter',
			'data-mask': this.mask
		})

	},
	initWatcher: function () {
		this.events = {
			'focusin': 'onFocusin',
			'focusout': 'onFocusout'
		};
		this.delegateEvents();
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

		if (user.getProp(this.options.name)) this.$el.val(user.getProp(this.options.name))
		return this;
	},
	validate: function () {
		if (!this.check()) {
			this.trigger('invalid');
			this.$el.parent().addClass('has-error');
			this.initWatcher();
			return false;
		}

		return true;
	},
	check: function () {
		if (this.$el.val() === this.mask) return false;

		if (this.re && !this.re.test(this.$el.val())) return false;
		return true;
	},
	setToUser: function () {
		user.setProp(this.options.name, this.$el.val());
	}
});