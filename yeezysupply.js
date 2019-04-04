
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
		"shoe_size": result.profiles[result.active].shoe_size
	};
	if(window.location.href.includes('shopifycs')){$(document).ready(function() {
	    document.getElementById('number').value = config.ccnumber;
	    document.getElementById('name').value = config.ccname;
	    document.getElementById('expiry').value = config.month + " / " + config.year;
	    document.getElementById('verification_value').value = config.cvv;
	});
}
});
