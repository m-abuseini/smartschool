var storage = (function() {
    
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

    var storeItem = function(name, value){
        if(localStorageTest()){
            setLocalStorageItem(name, value);
        }else{
            createSingleCookie(name, value);
        }
    };

    var fetchItem = function(name){
        if(localStorageTest()){
            return getLocalStorageItem(name);
        }else{
            return getCookie(name);
        }
    };

    var deleteItem = function(name){
         if(localStorageTest()){
            removeLocalStorageItem(name);
        }else{
            deleteSingleCookie(name);
        }
    }


    return {
        storeItem: function(name, value){
            setItem(name, value);
        },

        fetchItem: function(name){
            return getItem(name, value);
        },

        deleteItem: function(name){
            deleteItem(name);
        },

        getCookie: function(cookieName) {
            return getCookie(cookieName);
        },
        
        createCookie: function(cookieName, cookieValue) {
            createSingleCookie(cookieName, cookieValue);
        },
        
        deleteCookie: function(cookieName) {
            deleteSingleCookie(cookieName);
        },

        // checkLocalStorage: function() {
        //     return localStorageTest();
        // },
        
        // setLocalStorage: function(localStorageName, localStorageValue) {
        //     setLocalStorageItem(localStorageName, localStorageValue);
        // },
        
        // getLocalStorage: function(localStorageName) {
        //     return getLocalStorageItem(localStorageName);
        // },
        
        // removeLocalStorage: function(localStorageName) {
        //     removeLocalStorageItem(localStorageName);
        // }
    };
})();