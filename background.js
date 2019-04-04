

//background.js


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.choose_proxy){
		if (request.selected_proxy == "default"){
		    chrome.proxy.settings.set({
		        value: {
		            mode: "direct"
		        }
		    });
		    sendResponse({status: "cleared proxies"});
		}else {
		    var proxy_config = {
		        mode: "fixed_servers",
		        rules: {
		        singleProxy: {
		            scheme: "http",
		            host: request.host,
		            port: parseInt(request.port)
		        },
		        bypassList: ["foobar.com"]
		        }
		    }

		    chrome.proxy.settings.set(
		        {value: proxy_config, scope: 'regular'},
		        function() {}
		    );
		    sendResponse({status: "changed proxies"});
		}
	}
});

//Proxies auth user:pass listener

chrome.webRequest.onAuthRequired.addListener(
    function(details, callbackFn) {
        chrome.storage.sync.get("proxiesObj", function(result) {
        var proxiesObj = result.proxiesObj;
        console.log("proxiesAuth", proxiesObj);
        var selected_proxy = proxiesObj["selected_proxy"];
        var username = proxiesObj["proxies"][selected_proxy]["username"];
        var password = proxiesObj["proxies"][selected_proxy]["password"];
        // console.log()

        console.log("username, password", username, password);

        callbackFn({
            authCredentials: {username: username, password: password}
        });

        });

        console.log("onAuthRequired!", details, callbackFn);

    },
    {urls: ["<all_urls>"]},
    ['asyncBlocking']
);
