var storageManagement = (function() {
    
    var localStorageTest = function() {
        var test = "test";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
                return true;
        } catch (e) {
            return false;
        }
    };
    
    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    };
    
    var createSingleCookie = function(cName, value) {
        var expireCookie = new Date();
        var expireTime = expireCookie.getTime();
        expireTime += 60 * 60 * 100000000;
        expireCookie.setTime(expireTime);
        //document.cookie = cName + " = "+ value +"; expires="+expireCookie.toGMTString() +";domain = '"+getPath.hostName()+"' ; path = /";
        document.cookie = cName + " = " + value + "; expires=" + expireCookie.toGMTString() + "; path = /";
    };
    
    var deleteSingleCookie = function(cname) {
        var expiry = new Date();
        expiry.setTime(10);
        document.cookie = cname + '=; expiry= ' + expiry + '; path=/';
    };
    
    var setLocalStorageItem = function(name, value) {
        localStorage.setItem(name, value);
    };
    
    var getLocalStorageItem = function(name) {
        return localStorage.getItem(name);
    };
    
    var removeLocalStorageItem = function(name) {
        localStorage.removeItem(name);
    };
    return {
        checkLocalStorage: function() {
            return localStorageTest();
        },
        
        getCookieByName: function(cookieName) {
            return getCookie(cookieName);
        },
        
        createCookie: function(cookieName, cookieValue) {
            createSingleCookie(cookieName, cookieValue);
        },
        
        deleteCookie: function(cookieName) {
            deleteSingleCookie(cookieName);
        },
        
        setLocalStorage: function(localStorageName, localStorageValue) {
            setLocalStorageItem(localStorageName, localStorageValue);
        },
        
        getLocalStorage: function(localStorageName) {
            return getLocalStorageItem(localStorageName);
        },
        
        removeLocalStorage: function(localStorageName) {
            removeLocalStorageItem(localStorageName);
        }
    };
})();