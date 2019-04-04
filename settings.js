

function SetProxy(proxy, unsplit_proxy) {
	chrome.storage.sync.get("proxiesObj", function(result) {
		proxiesObj = result.proxiesObj;

		// proxiesObj = null;

		if (!proxiesObj) {
			chrome.storage.sync.set({
				proxiesObj: {
					selected_proxy: "default",
					proxies: {
						"default": {
							host: null,
							port: null,
							username: null,
							password: null,
							proxy_id: "default"
						}
					}
				}
			}, function() { $('#add-proxy-button').click(); }
			);
			console.log('created proxies obj');
		}else {
			chrome.runtime.sendMessage({choose_proxy: true, selected_proxy: unsplit_proxy, host: proxy[0], port:parseInt(proxy[1])}, function(response) {
				console.log(response.status);
			});

			proxiesObj["selected_proxy"] = unsplit_proxy;

    		//add proxy to proxies object for dropdown
			proxiesObj["proxies"][unsplit_proxy] = {
				host: proxy[0],
				port: parseInt(proxy[1]),
				username: proxy[2],
				password: proxy[3],
				proxy_id: unsplit_proxy
			};

			chrome.storage.sync.set({
				proxiesObj: proxiesObj
			}, function() {
				$('#proxy_list').append("<option value=\"" + unsplit_proxy + "\">" + proxy[0] + ":" + proxy[1] + ":" + proxy[2] + ":" + proxy[3] + "</option>")
			});
		}
		console.log('Proxies', 'Proxy saved.');
	});
}

function selectProxy(unsplit_proxy){
	chrome.storage.sync.get("proxiesObj", function(result) {

		proxiesObj = result.proxiesObj;

		if (!proxiesObj) {
			chrome.storage.sync.set({
				proxiesObj: {
					selected_proxy: "default",
					proxies: {
						"default": {
							host: null,
							port: null,
							username: null,
							password: null,
							proxy_id: "default"
						}
					}
				}
			}, function() {}
			);
			chrome.runtime.sendMessage({choose_proxy: true, selected_proxy: unsplit_proxy, host: null, port: null}, function(response) {
				console.log(response.status);
			});
		}else {
			proxies = proxiesObj["proxies"];
			console.log("unsplit_proxy", unsplit_proxy);
			chrome.storage.sync.set({
				proxiesObj: {
					selected_proxy: unsplit_proxy,
					proxies: proxies
				}
			});
			chrome.runtime.sendMessage({choose_proxy: true, selected_proxy: unsplit_proxy, host: proxiesObj["proxies"][unsplit_proxy]["host"], port: proxiesObj["proxies"][unsplit_proxy]["port"]}, function(response) {
				console.log(response.status);
			});
		}

	});

}

function save_options() {
	var name = $('#order_billing_name').val();
	var email = $('#order_email').val();
	var tel = $('#order_tel').val();
	var address = $('#order_address').val();
	var address2 = $('#order_address2').val();
	var zip = $('#order_billing_zip').val();
	var city = $('#order_billing_city').val();
	var state = $('#order_billing_state').val();
	var cc_name = $('#order_cc_name').val();
	var cc_number = $('#order_cc_number').val();
	var exp_month = $('#order_credit_card_month').val();
	var exp_year = $('#order_credit_card_year').val();
	var cvv = $('#order_cvv').val();
	var shoe_size = $("#shoe_size").val();
	var refresh_delay = $('#refresh_delay').val();
	var autocheckout = $('#autocheckout').val();
	chrome.storage.sync.get(null, (result) => {
		if (result) {
			let CurrentProfiles = result.profiles;
			if (CurrentProfiles) {
				CurrentProfiles[name] = {
					name: name,
				    email: email,
				    tel: tel,
				    address: address,
				    address2: address2,
				    zip: zip,
				    city: city,
				    state: state,
				    cc_name: cc_name,
				    cc_number: cc_number,
				    exp_month: exp_month,
				    exp_year: exp_year,
				    cvv: cvv,
					shoe_size: shoe_size,
					refresh_delay: refresh_delay,
					autocheckout:autocheckout
				};

				chrome.storage.sync.set({
					active: name,
					profiles: CurrentProfiles
				}, (result) => {
					console.log("saved new profile");
				});
			} else {
				chrome.storage.sync.set({
					profiles: {}
				}, (result) => {
					console.log("created new profile obj");
					save_options();
				});
			}
		}
	})
}

function load_options(){
	chrome.storage.sync.get(null, (result) => {
		if (result.profiles) {
			for (let profile in result.profiles) {
				$("#profileName").append(`<option value='${result.profiles[profile].name}'>${result.profiles[profile].name}</option>`);
			}
		}

		console.log(result.proxiesObj);
		if (result["proxiesObj"]) {
			var ProxiesJSON = result["proxiesObj"];

			$('#proxy_list').append("<option value=\"" + "default" + "\">" + "Default" + "</option>");

			for (var proxy in ProxiesJSON["proxies"]) {
				console.log("inputed proxy", proxy);
				if (proxy == "default"){
					console.log("hereyo");
					continue;
				}
				else{
					$('#proxy_list').append("<option value=\"" + ProxiesJSON["proxies"][proxy].proxy_id + "\">" + ProxiesJSON["proxies"][proxy].host + ":" + ProxiesJSON["proxies"][proxy].port + ":" + ProxiesJSON["proxies"][proxy].username + ":" + ProxiesJSON["proxies"][proxy].password + "</option>");
				}
			}
			$('#proxy_list').val(ProxiesJSON["selected_proxy"]);
		}
	});
}
function load_profile(name) {
	chrome.storage.sync.get(null, (result) => {
		if (result.profiles[name]) {
			$('#order_billing_name').val(result.profiles[name].name);
			$('#order_email').val(result.profiles[name].email);
			$('#order_tel').val(result.profiles[name].tel);
			$('#order_address').val(result.profiles[name].address);
			$('#order_address2').val(result.profiles[name].address2);
			$('#order_billing_zip').val(result.profiles[name].zip);
			$('#order_billing_city').val(result.profiles[name].city);
			$('#order_billing_state').val(result.profiles[name].state);
			$('#order_cc_name').val(result.profiles[name].cc_name);
			$('#order_cc_number').val(result.profiles[name].cc_number);
			$('#order_credit_card_month').val(result.profiles[name].exp_month);
			$('#order_credit_card_year').val(result.profiles[name].exp_year);
			$('#order_cvv').val(result.profiles[name].cvv);
			$('#shoe_size').val(result.profiles[name].shoe_size);
			$('#refresh_delay').val(result.profiles[name].refresh_delay);
			$('#autocheckout').val(result.profiles[name].autocheckout);
		}
	});
}
function setupbypass()
{
	chrome.storage.sync.set({bypass:'on'}, function() {
	console.log('on');
});
	window.setTimeout(function() {
		var win1 = window.open('https://yeezysupply.com/cart/add.js?id=870785548307', '_blank');
    window.setTimeout(function() {
			win1.location.href = 'https://yeezysupply.com/checkout'
			window.setTimeout(function() {
				win1.location.href = 'https://yeezysupply.com/cart/clear'
				window.setTimeout(function() {
					win1.close();
					chrome.storage.sync.set({bypass:'off'}, function() {
          console.log('off');
        });
			}, 150);
		}, 750);
    }, 200);
}, 150);
}
function clearCart()
{
	var win1 = window.open('https://yeezysupply.com/cart/clear', '_blank');
	setTimeout(function(){win1.close()}, 250);
}
function reset_options(){
	$('#order_billing_name').val('');
	$('#order_email').val('');
	$('#order_tel').val('');
	$('#order_address').val('');
	$('#order_address2').val('');
	$('#order_address3').val('');
	$('#order_billing_zip').val('');
	$('#order_billing_city').val('');
	$('#order_billing_state').val('');
	$('#order_cc_name').val('');
	$('#order_cc_number').val('');
	$('#order_credit_card_month').val('');
	$('#order_credit_card_year').val('');
	$('#order_cvv').val('');
	$('#shoe_size').val('');
	$('#refresh_delay').val('');
	$('#autocheckout').val('');
	chrome.storage.sync.set({
		profiles: {},
		proxiesObj:  {
			selected_proxy: "default",
			proxies: {
				default: {
					host: null,
					port: null,
					username: null,
					password: null,
					proxy_id: "default"
				}
			}
		}

	}, () => {
		location.reload();
	});
}

$(document).ready(() => {
	load_options();
	$("#saveProfile").click(() => {
		save_options();
	});
	$("#loadProfile").click(() => {
		load_profile($("#profileName").val());
	});
	$("#resetOpts").click(() => {
		reset_options();
	});
	$("#SetupBypass").click(() => {
		setupbypass();
	});
	$("#ClearCart").click(() => {
		clearCart();
	});

	$('#add-proxy-button').click(function() {
		let ProxyValue = $('#proxy_input').val();

		if (ProxyValue) {
			let SplitProxyValue = ProxyValue.split(':');

			let IPAddress = SplitProxyValue[0];
			let PortNumber = SplitProxyValue[1];
			let Username = SplitProxyValue[2];
			let Password = SplitProxyValue[3];

			SetProxy(SplitProxyValue, ProxyValue);
		}
	});

	$('#select-proxy-button').click(function() {
		let ProxyValue = $('#proxy_list').val();
		selectProxy(ProxyValue);
	})
});
