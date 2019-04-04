
chrome.storage.sync.get(null, function(result){

	var config = {
		"name": result.profiles[result.active].name,
		"email": result.profiles[result.active].email,
		"tel": result.profiles[result.active].tel,
		"address": result.profiles[result.active].address,
		"address2": result.profiles[result.active].address2,
		"address3": result.profiles[result.active].address3,
		"zip": result.profiles[result.active].zip,
		"city": result.profiles[result.active].city,
		"state": result.profiles[result.active].state,
		"ccname": result.profiles[result.active].cc_name,
		"ccnumber": result.profiles[result.active].cc_number,
		"month": result.profiles[result.active].exp_month,
		"year": result.profiles[result.active].exp_year,
		"cvv": result.profiles[result.active].cvv,
		"shoe_size": result.profiles[result.active].shoe_size,
		"refresh_delay": result.profiles[result.active].refresh_delay,
		"autocheckout": result.profiles[result.active].autocheckout,
		"bypass":result.bypass,
		"bypassUrl": result.bypassUrl
	};
	atc_and_checkout_yzysply(config);

});

function atc_and_checkout_yzysply(config)
{
	if(window.location.href.indexOf('checkouts') > -1 && config.bypass == 'on' && window.location.href.indexOf('shopifycs') == -1)
	{
		chrome.storage.sync.set({bypassUrl:window.location.href}, function() {
		console.log('bypassLoaded');
		});
	}
	if(config.bypassUrl && config.bypassUrl.length > 0)
	{
		if(window.location.href.indexOf('throttle') > -1)
		{
			window.location.href = config.bypassUrl;
			//alert('bypassed');
			chrome.storage.sync.set({bypassUrl:''}, function() {
			console.log('bypassUnloaded');
			});
		}
	}
	var current_url = window.location.href;
	var base_url = window.location.hostname;
		var checkoutAddressPage = false;
		var productPage = false;
		var checkoutShippingPage = false;
		var checkoutCreditCardPage = false;
		var checkoutPage = false;
		if(document.getElementsByClassName('PI__select PI__input js-select js-select-SIZE js-select-SIZE-static')[0])
		{
			productPage = true;
		}
		if($("#checkout_shipping_address_first_name")[0])
		{
			checkoutAddressPage = true;
		}
		if($("#checkout_different_billing_address_false")[0]){
			checkoutCreditCardPage = true;
		}
		if(document.getElementsByClassName('K__button CA__button-checkout')[0])
		{
			if(document.getElementsByClassName('K__button CA__button-checkout')[0].value == 'CHECK OUT')
			{
				checkoutPage = true;
			}
		}
		if(document.getElementsByClassName('step__footer__previous-link-content')[0])
		{
			if(document.getElementsByClassName('step__footer__previous-link-content')[0].innerText == "RETURN TO CUSTOMER INFORMATION")
			{
				checkoutShippingPage = true;
			}
		}
		if(productPage)
		{
			var desiredValue = config.shoe_size;
			var el = document.getElementsByClassName('PI__select PI__input js-select js-select-SIZE js-select-SIZE-static')[0];
			for(var i=0; i<el.options.length; i++) {
  				if ( el.options[i].text == desiredValue ) {
   				 	el.selectedIndex = i;
   				 	break;
  					}
				}
				var purchase_button = document.getElementsByName('add')[0];
				purchase_button.click();}
		if(checkoutPage)
		{
			var checkout_button = document.getElementsByName('checkout')[0];
			checkout_button.click();
		}
		if(checkoutAddressPage)
		{
			if(document.getElementById('salesFinal'))
			{
				document.getElementById('salesFinal').click();
			}
			var email_field = $("#checkout_email")[0];
			email_field.value = config.email;
			var first_name_field = $("#checkout_shipping_address_first_name")[0];
			var first_name = config.name.split(' ');
			first_name_field.value = first_name[0];
			var last_name_field = $("#checkout_shipping_address_last_name")[0];
			last_name_field.value = first_name[1];
			var address_field = $("#checkout_shipping_address_address1")[0];
			address_field.value = config.address;
			var apt_field = $("#checkout_shipping_address_address2")[0];
			apt_field.value = config.address2;
			var city_field = $("#checkout_shipping_address_city")[0];
			city_field.value = config.city;
			var zip_field = $("#checkout_shipping_address_zip")[0];
			zip_field.value = config.zip;
			var tel_field = $("#checkout_shipping_address_phone")[0];
			tel_field.value = config.tel;
			var desiredState = config.state;
			var state_field = document.getElementById('checkout_shipping_address_province');
			for(var i = 0; i < state_field.options.length; i++)
			{
				if(state_field.options[i].text == desiredState)
				{
					state_field.selectedIndex = i;
					break;
				}
			}
		}
		if(checkoutShippingPage)
		{
			var continue_to_shipping_button = document.getElementsByClassName('step__footer__continue-btn btn ')[0];
			continue_to_shipping_button.click();
		}
		if(checkoutCreditCardPage)
		{
			var check_field = $('#checkout_different_billing_address_false')[0];
			check_field.click();
		}
		if(window.location.href.indexOf('processing') > -1)
		{
			post_success();
		}
}


function post_success()
{
	$.post('https://discordapp.com/api/webhooks/421858685397237760/c980R5RAqNa9PT4YYaaijHRvR8n4qFQXRbERiF09REpqoYOUpNuugRzhfhCU9VUcdWD5',{ "content": "Completed Order! XO Was here - but was removed ;) " , "username": "Checkout Links", "avatar_url": ""});
}
