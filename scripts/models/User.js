var B = require('backbone')

var User  =B.Model.extend({
	defaults: {
		"city": null,
		"applicant": null,
		"user": {
			"name": null,
			"phone": null,
			"email": null,
			"password": null,
		},
		"car_model": null,
		"company": {
			"vat_number": null,
			"company_name": null,
			"address": { 
				"line1": null,
				"line2": null,
				"postal_code": null,
				"company_city": null,
				"country_code": null,
			}
		}
	},
	initialize: function () {
	},
	setProp: function sp (prop, value, obj) {
		obj = obj || this.attributes;
		prop = prop.replace(' ', '').toLowerCase()
		for (var p in obj) {
			if (prop === p.replace('_', '')) {
				obj[p] = value;
				break;
			}
			if (typeof obj[p] === 'object') sp(prop, value, obj[p])
		}
	},
	getProp: function gp (prop, obj) {
		var ret;

		obj = obj || this.attributes;
		prop = prop.replace(' ', '').toLowerCase()
		for (var p in obj) {
			if (prop === p.replace('_', '')) {
				return obj[p]
			}

			if (typeof obj[p] === 'object' && obj[p] !== null) ret = gp(prop, obj[p])

			if (ret) break
		}

		return ret;
	}
})

module.exports = new User()