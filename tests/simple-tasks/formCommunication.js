var requestHandler = (function() {
    var APIservice = "",
        requestMethod = "",
        token = "";
        
    var requestHandlerConfig = {
        "domain": getPath.protocol() + "//" + getPath.host() + "" + getContextPath() + "api/",
        "login": "login/"
    };
    
    var sendRequest = function(payload, headers ,sCallback, fCallback,, arg) {
        var request = shahidQuery.ajax({
            url: requestHandlerConfig.domain + "" + APIservice + "?" + rand(),
            data: payload,
            contentType: "application/json; charset=utf-8",
            method: requestMethod,
            async: true,
            cache: false,
            beforeSend: function(xhr) {
                if (checkForToken()) {
                    var user;
                    if (storageManagement.checkLocalStorage()) {
                        token = JSON.parse(storageManagement.getLocalStorage("token"));
                    } else {
                        token = JSON.parse(storageManagement.getCookieByName("token"));
                    }
                    xhr.setRequestHeader("x-access-token", token);
                }
                for (var header in headers) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }
        });
        request.done(function(response) {
            handleRequestSuccess(response, sCallback, arg);
            return false;
        });
        
        request.fail(function(response) {
            handleRequestErrors(response, fCallback);
        });
        
    };
    
    
    var handleRequestErrors = function(response, fCallback) {
        alert(response);
        fCallback(response);
    };
    
    var handleRequestSuccess = function(response, sCallback, arg) {
        sCallback(response, arg);
    };
    
    var checkForToken = function() {
        var storageValue = "";
        if (storageManagement.checkLocalStorage()) {
            storageValue = storageManagement.getLocalStorage("token");
            if (storageValue != null) {
                token = storageValue;
                return true;
            } else {
                token = "";
            }
        } else {
            storageValue = storageManagement.getCookieByName("token");
            if (storageValue != "") {
                token = storageValue;
                return true;
            } else {
                token = "";
            }
        }
        return false;
    };
    
        
    return {
        sendRequest: function(service, method, sCallback, fCallback, payload, headers, arg) {
            APIservice = requestHandlerConfig[service];
            requestMethod = method;
            sendRequest(payload, headers, sCallback, fCallback, arg);
        },
        
        checkUsersToken: function() {
            return checkForToken();
        }
    };
})();



function rand() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}