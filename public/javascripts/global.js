//global.js


/*/     FORM Collector CODE     /*/

"use strict";

/*\
|*|
|*|  :: XMLHttpRequest.prototype.sendAsBinary() Polyfill ::
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#sendAsBinary()
\*/

if (!XMLHttpRequest.prototype.sendAsBinary) {
	XMLHttpRequest.prototype.sendAsBinary = function(sData) {
		var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
		for (var nIdx = 0; nIdx < nBytes; nIdx++) {
			ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
		}
		/* send as ArrayBufferView...: */
		this.send(ui8Data);
		/* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
  };
}

/*\
|*|
|*|  :: AJAX Form Submit Framework ::
|*|	 https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
|*|  https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntax:
|*|
|*|   AJAXSubmit(HTMLFormElement);
\*/

var AJAXSubmit = (function () {

	function ajaxSuccess () {
		/* console.log("AJAXSubmit - Success!"); */
		alert(this.responseText);
		/* you can get the serialized data through the "submittedData" custom property: */
		/* alert(JSON.stringify(this.submittedData)); */
	}

	function submitData(oData){
		/* the AJAX request... */
		var oAjaxReq = new XMLHttpRequest();
		oAjaxReq.submittedData = oData;
		oAjaxReq.onload = ajaxSuccess;
		if (oData.technique === 0) {
			/* method is GET */
			oAjaxReq.open("get", oData.receiver.replace(/(?:\?.*)?$/, oData.segments.length > 0 ? "?" + oData.segments.join("&") : ""), true);
			oAjaxReq.send(null);
		}else{
			/* method is POST */
			oAjaxReq.open("post", oData.receiver, true);
			if (oData.technique === 3) {
				/* enctype is multipart/form-data */
				var sBoundary = "---------------------------" + Date.now().toString(16);
				oAjaxReq.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + sBoundary);
				oAjaxReq.sendAsBinary("--" + sBoundary + "\r\n" + oData.segments.join("--" + sBoundary + "\r\n") + "--" + sBoundary + "--\r\n");
			}else{
				/* enctype is application/x-www-form-urlencoded or text/plain */
				oAjaxReq.setRequestHeader("Content-Type", oData.contentType);
				oAjaxReq.send(oData.segments.join(oData.technique === 2 ? "\r\n" : "&"));
			}
		}
	}

	function processStatus (oData) {
		if (oData.status > 0) { return; }
		/* the form is now totally serialized! do something before sending it to the server... */
		/* doSomething(oData); */
		/* console.log("AJAXSubmit - The form is now serialized. Submitting..."); */
		submitData (oData);
	}

	function pushSegment (oFREvt) {
		this.owner.segments[this.segmentIdx] += oFREvt.target.result + "\r\n";
		this.owner.status--;
		processStatus(this.owner);
	}

	function plainEscape (sText) {
		/* how should I treat a text/plain form encoding? what characters are not allowed? this is what I suppose...: */
		/* "4\3\7 - Einstein said E=mc2" ----> "4\\3\\7\ -\ Einstein\ said\ E\=mc2" */
		return sText.replace(/[\s\=\\]/g, "\\$&");
	}

	function SubmitRequest (oTarget) {
		var nFile, sFieldType, oField, oSegmReq, oFile, bIsPost = oTarget.method.toLowerCase() === "post";
		/* console.log("AJAXSubmit - Serializing form..."); */
		this.contentType = bIsPost && oTarget.enctype ? oTarget.enctype : "application\/x-www-form-urlencoded";
		this.technique = bIsPost ? this.contentType === "multipart\/form-data" ? 3 : this.contentType === "text\/plain" ? 2 : 1 : 0;
		this.receiver = oTarget.action;
		this.status = 0;
		this.segments = [];
		var fFilter = this.technique === 2 ? plainEscape : escape;
		for (var nItem = 0; nItem < oTarget.elements.length; nItem++) {
			oField = oTarget.elements[nItem];
			if (!oField.hasAttribute("name")) { continue; }
			sFieldType = oField.nodeName.toUpperCase() === "INPUT" ? oField.getAttribute("type").toUpperCase() : "TEXT";
			if (sFieldType === "FILE" && oField.files.length > 0) {
				if (this.technique === 3) {
					/* enctype is multipart/form-data */
					for (nFile = 0; nFile < oField.files.length; nFile++) {
						oFile = oField.files[nFile];
						oSegmReq = new FileReader();
						/* (custom properties:) */
						oSegmReq.segmentIdx = this.segments.length;
						oSegmReq.owner = this;
						/* (end of custom properties) */
						oSegmReq.onload = pushSegment;
						this.segments.push("Content-Disposition: form-data; name=\"" + oField.name + "\"; filename=\""+ oFile.name + "\"\r\nContent-Type: " + oFile.type + "\r\n\r\n");
						this.status++;
						oSegmReq.readAsBinaryString(oFile);
					}
				} else {
					/* enctype is application/x-www-form-urlencoded or text/plain or method is GET: files will not be sent! */
					for (nFile = 0; nFile < oField.files.length; this.segments.push(fFilter(oField.name) + "=" + fFilter(oField.files[nFile++].name)));
				}
			} else if ((sFieldType !== "RADIO" && sFieldType !== "CHECKBOX") || oField.checked) {
				/* field type is not FILE or is FILE but is empty */
				this.segments.push(
					this.technique === 3 ? /* enctype is multipart/form-data */
					"Content-Disposition: form-data; name=\"" + oField.name + "\"\r\n\r\n" + oField.value + "\r\n"
					: /* enctype is application/x-www-form-urlencoded or text/plain or method is GET */
					fFilter(oField.name) + "=" + fFilter(oField.value)
				);
			}
		}
		processStatus(this);
	}

	return function (oFormElement) {
		if (!oFormElement.action) { return; }
		new SubmitRequest(oFormElement);
	};

})();




/*/     FORM Collector CODE     END /*/


/*/     FORM Setter CODE     /*/

var delegate = function(criteria, listener) {
	  	return function(e) {
		    var el = e.target;
			    do {
			      if (!criteria(el)) continue;
			      e.delegateTarget = el;
			      listener.apply(this, arguments);
			      return;
			    } while( (el = el.parentNode) );
		};
	};



	var formSetter = function(){
		while (formHandler.formContainer.firstChild) {
		    formHandler.formContainer.removeChild(formHandler.formContainer.firstChild);
		}
		var list;
		jQuery.getJSON(formConfig.getAction,function(data){
			list = data
			var listLength = list.length,
	  	  formId ;
			  for(var i=0;i<listLength;i++){
			  	jQuery("#wrapper").append("============== "+i+" ==============");
			    var form = jQuery("<form>").attr({"method":"post","role":"form"});
			    for(var key in list[i]){
			    	if(key === "_id"){
			    		formId = "id-"+list[i][key];
			    		form.attr("id",formId);
			    		form.append(jQuery("<input>").attr({
			    			"name":key,
			    			"value": list[i][key],
			    			"disabled":"disabled",
			    			"type": "text"
			    			,"style":"display:none"
			    		}));
			    	}else{
			    		//should add type based on field type
			    		//for now all fields are text
			    		form.append(jQuery("<input>").attr({"name":key,"value": list[i][key],"disabled":"disabled","type": "text"}));
			    		//checkFieldType();
			    	}
			    }

			    var recordButtoncontainer = jQuery("<div>").attr({"class":"recordButtonContainer"});
				    recordButtoncontainer.append(jQuery("<a>").attr({"class":"deleteRecord btn","href":"javascript:;"}).html("Delete"));
				    recordButtoncontainer.append(jQuery("<a>").attr({"class":"editRecord btn","href":"javascript:;"}).html("edit"));
				    recordButtoncontainer.append(jQuery("<button>").attr({"class":"updateRecord btn"}).html("update"));
			    	// add buttons [link = update; button = update; link as button or icon = delete;]

			    form.append(recordButtoncontainer);
			    jQuery("#wrapper").append(form);
			  	formHandler.initRecord(formId,"recordButtonContainer");  
			  }
			  
			  jQuery("#wrapper").append("<br>");
			  var addRecordButton = jQuery("<a>").attr({"href":"javascript:;","class": "addRecordButton"}).html("add");
			  jQuery("#wrapper").append(addRecordButton);
		});
	};


	var formHandler = {
	
		formNavigation : null,
		formNavigationButtons: null,
		formContainer : null,
		formAvailableForms: null,

		//
		recordContainer: null,
		recordButtonsContainer: null,
		recordsMainContainer: null,

		
		initNavigation: function(formNav,formContainer){
			formHandler.formNavigation = document.querySelector("#"+formNav);
			formHandler.formNavigationButtons = document.querySelectorAll("#"+formNav+" ul li.btn");
			formHandler.formContainer  = document.querySelector("#"+formContainer);
			//formHandler.formAvailableForms = document.querySelectorAll("#"+formContainer+" section.hidden-form");
			
			formHandler.initFormNavigation();
		},

		initRecord: function(rContainer,rButtonsContainer){
			formHandler.recordContainer = document.querySelector("#"+ rContainer);
			formHandler.recordButtonsContainer = document.querySelector("."+rButtonsContainer);
			formHandler.recordsMainContainer = formHandler.formContainer;
			formHandler.initRecordManipulation();
		},
		
		initFormNavigation: function(){
			formHandler.formNavigation.addEventListener("click", delegate(formHandler.buttonsFilter, formHandler.navigationButtonHandler));
		},

		initRecordManipulation: function(){
			formHandler.recordContainer.addEventListener("click", delegate(formHandler.buttonsFilter, formHandler.recordButtonHandler));
		},
		
		navigationButtonHandler: function(e) {
			var button = e.delegateTarget;
			if(!button.classList.contains("current")){
				[].forEach.call(formHandler.formNavigationButtons, function(el) {
					el.classList.remove("current");
				});
				button.classList.add("current");
				var navItemClassList = button.children[0].classList;
				// [].forEach.call(formHandler.formAvailableForms, function(el) {
				// 	if(el.classList.contains(navItemClassList)){
				// 		el.classList.add("selected");
				// 	}else{
				// 		el.classList.remove("selected");
				// 	}
				// });

				if(navItemClassList.contains("languages")){
					viewsManipulation.languagesView();
				}else if(navItemClassList.contains("countries")){
					viewsManipulation.countriesView();
				}else if(navItemClassList.contains("cities")){
					viewsManipulation.citiesView();
				}else if(navItemClassList.contains("province")){
					viewsManipulation.provinceView();
				}else if(navItemClassList.contains("addresses")){
					viewsManipulation.addressesView();
				}else if(navItemClassList.contains("schools")){
					viewsManipulation.schoolsView();
				}else if(navItemClassList.contains("classes")){
					viewsManipulation.classesView();
				}else if(navItemClassList.contains("sections")){
					viewsManipulation.sectionsView();
				}else if(navItemClassList.contains("subjects")){
					viewsManipulation.subjectsView();
				}else if(navItemClassList.contains("personaldocuments")){
					viewsManipulation.personaldocumentsView();
				}else if(navItemClassList.contains("educationaldocuments")){
					viewsManipulation.educationaldocumentsView();
				}else if(navItemClassList.contains("parents")){
					viewsManipulation.parentsView();
				}else if(navItemClassList.contains("students")){
					viewsManipulation.studentsView();
				}else if(navItemClassList.contains("teachers")){
					viewsManipulation.teachersView();
				}else if(navItemClassList.contains("trips")){
					viewsManipulation.tripsView();
				}else if(navItemClassList.contains("shifts")){
					viewsManipulation.shiftsView();
				}else if(navItemClassList.contains("buses")){
					viewsManipulation.busesView();
				}else if(navItemClassList.contains("roles")){
					viewsManipulation.rolesView();
				}else if(navItemClassList.contains("privilages")){
					viewsManipulation.privilagesView();
				}
			}else{
				button.classList.remove("current");
			}
		},

		recordButtonHandler: function(e){
			e.preventDefault();
			var button = e.delegateTarget;
			if(button.classList.contains("deleteRecord")){
				formHandler.enableDeleterecordBehavior(button);
			}else if(button.classList.contains("editRecord")){
				formHandler.enableEditrecordBehavior(button);
			}else if(button.classList.contains("updateRecord")){
				formHandler.enableUpdateRecordBehavior(button);
			}else if(button.classList.contains("addRecord")){
				formHandler.enableAddeRecordBehavior(button);
			}
		},
		
		enableAddeRecordBehavior: function(button){
			var form = button.parentElement.parentNode;
			if(form.nodeName !== "FORM" ){return;}
			form.setAttribute("action",formConfig.addAction);
			AJAXSubmit(form);
			console.log("add button Form");
		},
		enableDeleterecordBehavior: function(button){
			var record = button.parentElement.parentNode;
			var recordId = record.id;
			if(record.nodeName !== "FORM" ){return;}
			// formHandler delete method / accepts PARAM of record
			formHandler.deleteRecordFunc(record);
			console.log("Delete Form");
		},

		enableEditrecordBehavior: function(button){
			var record = button.parentElement.parentNode;
			var recordId = record.id;
			for(var input in record.childNodes){
				var child = record.childNodes[input];
				if(child.tagName !== "INPUT"){return;}
				child.removeAttribute("disabled");
				var updateBtn = record.querySelector('.updateRecord');
				updateBtn.setAttribute("style","display: inline-block");
			}
			//removeAttribute("disabled");
			console.log("Edit Form");
		},

		enableUpdateRecordBehavior: function(button){
			var form = button.parentElement.parentNode;
			if(form.nodeName !== "FORM" ){return;}
			form.setAttribute("action",formConfig.updateAction);
			AJAXSubmit(form);
			console.log("Update Form");
		},

		deleteRecordFunc: function(record){
			var dbId = record.id;
			dbId = dbId.substring(3);
			jQuery.ajax({
				type: 'DELETE',
				url: formConfig.deleteAction+'/'+dbId
			}).done(function(response){
				if(response.msg === ''){
					// on success of removal
					formHandler.recordsMainContainer.removeChild(record);
				}else{
					alert('error = '+ response.msg);
				}
			});
		},


		buttonsFilter: function(elem) { return elem.classList && elem.classList.contains("btn"); },

	}


	var formConfig = {};



    var viewsManipulation = {

    	usersView: function(){
		    formConfig.getAction = "api/users/list";
		    formConfig.deleteAction = "api/users/delete";
		    formConfig.updateAction = "api/users/update";
		    formConfig.addAction = "api/users/add";

		    viewsManipulation.finalAct();
    	},

    	countriesView: function(){
    		formConfig.getAction = "api/countries/list";
		    formConfig.deleteAction = "api/countries/delete";
		    formConfig.updateAction = "api/countries/update";
		    formConfig.addAction = "api/countries/add";

		    viewsManipulation.finalAct();
    	},

    	schoolsView: function(){
    		formConfig.getAction = "api/schools/list";
		    formConfig.deleteAction = "api/schools/delete";
		    formConfig.updateAction = "api/schools/update";
		    formConfig.addAction = "api/schools/add";

		    viewsManipulation.finalAct();
    	},

    	languagesView: function(){
		    formConfig.getAction = "api/languages/list";
		    formConfig.deleteAction = "api/languages/delete";
		    formConfig.updateAction = "api/languages/update";
		    formConfig.addAction = "api/languages/add";

		    viewsManipulation.finalAct();
    	},

    	citiesView: function(){
    		formConfig.getAction = "api/cities/list";
		    formConfig.deleteAction = "api/cities/delete";
		    formConfig.updateAction = "api/cities/update";
		    formConfig.addAction = "api/cities/add";

		    viewsManipulation.finalAct();
    	},

    	provinceView: function(){
    		formConfig.getAction = "api/province/list";
		    formConfig.deleteAction = "api/province/delete";
		    formConfig.updateAction = "api/province/update";
		    formConfig.addAction = "api/province/add";

		    viewsManipulation.finalAct();
    	},



    	addressesView: function(){
		    formConfig.getAction = "api/addresses/list";
		    formConfig.deleteAction = "api/addresses/delete";
		    formConfig.updateAction = "api/addresses/update";
		    formConfig.addAction = "api/addresses/add";

		    viewsManipulation.finalAct();
    	},

    	classesView: function(){
    		formConfig.getAction = "api/classes/list";
		    formConfig.deleteAction = "api/classes/delete";
		    formConfig.updateAction = "api/classes/update";
		    formConfig.addAction = "api/classes/add";

		    viewsManipulation.finalAct();
    	},

    	sectionsView: function(){
    		formConfig.getAction = "api/sections/list";
		    formConfig.deleteAction = "api/sections/delete";
		    formConfig.updateAction = "api/sections/update";
		    formConfig.addAction = "api/sections/add";

		    viewsManipulation.finalAct();
    	},

    	subjectsView: function(){
    		formConfig.getAction = "api/subjects/list";
		    formConfig.deleteAction = "api/subjects/delete";
		    formConfig.updateAction = "api/subjects/update";
		    formConfig.addAction = "api/subjects/add";

		    viewsManipulation.finalAct();
    	},



    	personaldocumentsView: function(){
		    formConfig.getAction = "api/personaldocuments/list";
		    formConfig.deleteAction = "api/personaldocuments/delete";
		    formConfig.updateAction = "api/personaldocuments/update";
		    formConfig.addAction = "api/personaldocuments/add";

		    viewsManipulation.finalAct();
    	},

    	educationaldocumentsView: function(){
    		formConfig.getAction = "api/educationaldocuments/list";
		    formConfig.deleteAction = "api/educationaldocuments/delete";
		    formConfig.updateAction = "api/educationaldocuments/update";
		    formConfig.addAction = "api/educationaldocuments/add";

		    viewsManipulation.finalAct();
    	},

    	parentsView: function(){
    		formConfig.getAction = "api/parents/list";
		    formConfig.deleteAction = "api/parents/delete";
		    formConfig.updateAction = "api/parents/update";
		    formConfig.addAction = "api/parents/add";

		    viewsManipulation.finalAct();
    	},

    	studentsView: function(){
		    formConfig.getAction = "api/students/list";
		    formConfig.deleteAction = "api/students/delete";
		    formConfig.updateAction = "api/students/update";
		    formConfig.addAction = "api/students/add";

		    viewsManipulation.finalAct();
    	},

    	teachersView: function(){
    		formConfig.getAction = "api/teachers/list";
		    formConfig.deleteAction = "api/teachers/delete";
		    formConfig.updateAction = "api/teachers/update";
		    formConfig.addAction = "api/teachers/add";

		    viewsManipulation.finalAct();
    	},

    	tripsView: function(){
    		formConfig.getAction = "api/trips/list";
		    formConfig.deleteAction = "api/trips/delete";
		    formConfig.updateAction = "api/trips/update";
		    formConfig.addAction = "api/trips/add";

		    viewsManipulation.finalAct();
    	},



    	shiftsView: function(){
		    formConfig.getAction = "api/shifts/list";
		    formConfig.deleteAction = "api/shifts/delete";
		    formConfig.updateAction = "api/shifts/update";
		    formConfig.addAction = "api/shifts/add";

		    viewsManipulation.finalAct();
    	},

    	busesView: function(){
    		formConfig.getAction = "api/buses/list";
		    formConfig.deleteAction = "api/buses/delete";
		    formConfig.updateAction = "api/buses/update";
		    formConfig.addAction = "api/buses/add";

		    viewsManipulation.finalAct();
    	},

    	rolesView: function(){
    		formConfig.getAction = "api/roles/list";
		    formConfig.deleteAction = "api/roles/delete";
		    formConfig.updateAction = "api/roles/update";
		    formConfig.addAction = "api/roles/add";

		    viewsManipulation.finalAct();
    	},

    	privilagesView: function(){
    		formConfig.getAction = "api/privilages/list";
		    formConfig.deleteAction = "api/privilages/delete";
		    formConfig.updateAction = "api/privilages/update";
		    formConfig.addAction = "api/privilages/add";

		    viewsManipulation.finalAct();
    	},

    	finalAct: function(){
    		formSetter();
    	}
    	
    }

    var bindAddrecordButton = function(){
    	jQuery("#wrapper").on("click",".addRecordButton",function(e){
    		e.preventDefault();
    		var newRecord;
    		for(var ele in formHandler.recordsMainContainer.childNodes){
    			if(formHandler.recordsMainContainer.childNodes[ele].nodeName === "FORM"){
    				newRecord = formHandler.recordsMainContainer.childNodes[ele].cloneNode(true);
    				break;
    			}
    		}
    		manipulateAddedRecord(newRecord);
    	});
    }

    var manipulateAddedRecord = function(record){
    	record.removeAttribute("id");
    	record.setAttribute("id","new-record");
    	//record.setAttribute("action",formConfig.addAction);
    	var recordchildrenLength = record.childNodes.length;
    	for(var input=0;input<recordchildrenLength;input++){
    		if(record.childNodes[input] === undefined ){continue;}
    		if(record.childNodes[input].tagName === "INPUT"){
    			record.childNodes[input].removeAttribute("disabled");
    			record.childNodes[input].removeAttribute("value");
    		}
    		if(record.childNodes[input].name === "_id"){
    			record.removeChild(record.childNodes[input]);
    			input --;
    			//record.childNodes[input].remove();
    		}else if(record.childNodes[input].classList.length > 0 && record.childNodes[input].classList.contains("recordButtonContainer")){
    			while (record.childNodes[input].firstChild) {
				    record.childNodes[input].removeChild(record.childNodes[input].firstChild);
				}
				var addButton = document.createElement("button");
				addButton.setAttribute("class","btn addRecord");
				//addButton.setAttribute("onsubmit","e.preventDefault();AJAXSubmit(this);return false;"); 
				var textNode = document.createTextNode("save");
				addButton.appendChild(textNode);
				record.childNodes[input].appendChild(addButton);
    		}
    	}
    	var addRecordButton = document.querySelector(".addRecordButton");
    	formHandler.recordsMainContainer.insertBefore(record,addRecordButton);
    	formHandler.initRecord("new-record","recordButtonContainer");  
    }

	// jQuery("document").ready(function(){
	// 	// navigation requires #navigationcontainer[id], #formContainer[id]
	// 	formHandler.initNavigation("forms-navigation","wrapper");
	//   	//formSetter();
	//   	bindAddrecordButton();
	// });





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
            storeItem(name, value);
        },

        fetchItem: function(name){
            return fetchItem(name);
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








var getPath = {
  /**
    http://www.zlious.com:8080/index.html#tab2?foo=789

    Property    Result
    -------------------------------------------
    host        www.zlious.com:8080
    hostname    www.zlious.com
    port        8080
    protocol    http:
    pathname    index.html
    href        http://www.zlious.com:8080/index.html#tab2
    hash        #tab2
    search      ?foo=789
  */
  
    host: function() {
    return jQuery(location).attr('host');
  },
  
    hostName: function() {
    return jQuery(location).attr('hostname');
  },
  
    port: function() {
    return jQuery(location).attr('port');
  },
  
    protocol: function() {
    return jQuery(location).attr('protocol');
  },
  
    pathName: function() {
    return jQuery(location).attr('pathname');
  },
  
    href: function() {
    return jQuery(location).attr('href');
  },
  
    hash: function() {
    return jQuery(location).attr('hash');
  },
  
  search: function() {
    return jQuery(location).attr('search');
  }

  // redirectTo: function(url){
  // 	window.locaion = getPath.host() + "/"+ url;
  // }
}





/**********************************
***********************************
requestHandler to handle requests
***********************************
***********************************/

var requestHandler = (function() {
    var APIservice = "",
        requestMethod = "",
        token = "";
        
    var requestHandlerConfig = {
        "domain": getPath.protocol() + "//" + getPath.host() + "/",
        "login": "login/",
        "getAddress":"api/addresses/getaddress",
        "getDropPoint": "api/drop_points/getdroppoint",
        "getPickupPoint": "api/pickup_points/getpickuppoint",
        "addDropPoint" : "api/drop_points/add",
        "addPickupPoint" : "api/pickup_points/add",
        "getTrip": "api/trips/gettrip",
        "getTripByPoint": "api/trips/gettripbypoint"
    };
    
    var sendRequest = function(payload, headers ,sCallback, fCallback, arg) {
        var request = jQuery.ajax({
            url: requestHandlerConfig.domain + "" + APIservice + "?" + rand(),
            data: payload,
            contentType: "application/json; charset=utf-8",
            method: requestMethod,
            async: true,
            cache: false,
            beforeSend: function(xhr) {
                if (checkForToken()) {
                    token = JSON.parse(storage.fetchItem("token"));
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
        
        storageValue = storage.fetchItem("token");
        if (storageValue != "" && storageValue != null) {
        	token = storageValue;
            return true;	
        }else{
        	token = "";
        	return false;
        }

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


var login = {

	init: function(){

		login.bindButtonsAction();
	},

	bindButtonsAction: function(){
		jQuery('a#submitLogin').on('click',function(e){
			e.preventDefault();
			login.submitLogin();
		});
	},

	submitLogin: function(){
		var payload = {},
		emailField = jQuery('#loginEmail').val(),
		passwordField = jQuery('#loginPassword').val();

		if(emailField.length <= 0 || passwordField.length <= 0 ){
			alert("all fields should have data");
			return;
		}
		payload.email = emailField;
		payload.password = passwordField;
		payload = JSON.stringify(payload);
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('login','POST',login.success,login.fail, payload);
	},

	success: function(response){
		console.log(response);
		storage.storeItem('token', JSON.stringify(response.token));
		storage.storeItem('user', JSON.stringify(response.user));
		//getPath.redirectTo("map");
		//res.redirect("/map");
		jQuery(".container").empty();
		switch(response.user_type){
			case "1":
				parent.init();
				break;
			case "2":

				break;
			case "3":
				bus.init();
				break;
		}
		
	},
	fail: function(response){
		alert('check console for errors');
		console.log(response);
	}
}

var parent = {

	init: function(){
		parent.drawChildrenInfo();
	},

	bindButtonsAction: function(){
		jQuery(".container").on('click','a.childItemAnchor',function(e){
			e.preventDefault();
			var _this = e.target;
			var childAddress = _this.parentNode.getAttribute("child-address");
			var childId = _this.parentNode.getAttribute("child-id");
			jQuery(".childrenList .childItem").removeClass("active");
			_this.parentNode.classList.add("active");
			jQuery(".childInfo").empty();
			if(storage.fetchItem("address_"+childId) == undefined || storage.fetchItem("address_"+childId) == ""){
				child.getAddress(childAddress,childId);
			}else{
				child.markAddresses(JSON.parse(storage.fetchItem("address_"+childId)));
			}
		});
	},


	drawChildrenInfo: function(){
		var parentObj = JSON.parse(storage.fetchItem("user")),
			childrenObj = parentObj.children;

		var childrenList = jQuery("<ul>").addClass("childrenList");
		for(var i=0;i<childrenObj.length;i++){
			var childrenItem = jQuery("<li>").attr({"child-address":childrenObj[i].address,"child-id":childrenObj[i].child_id,"class": "childItem"});
			childrenItem.append(jQuery("<a>").attr({"href":"javascript:;","class":"childItemAnchor"}).html(childrenObj[i].full_name));
			childrenList.append(childrenItem);
		}
		jQuery(".container").append(childrenList);
		jQuery(".container").append(jQuery("<div>").addClass("childInfo"));
		parent.bindButtonsAction();
	}
};


var child = {
	getAddress: function(address_id, child_id){
		var payload = 'id='+address_id,
			headers = {},
			arg = child_id;
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('getAddress','GET',child.addressSuccess,child.addressFail, payload, headers,arg);
	},

	addressSuccess: function(response,arg){
		storage.storeItem('address_'+arg, JSON.stringify(response.address));
		console.log(response.address);
		child.markAddresses(response.address);
	},

	addressFail: function(response){
		console.log(response);
	},

	markAddresses: function(addressObj){
		var pickupPoints = addressObj.pickup_points,
			dropPoints = addressObj.drop_points;
			
		if(dropPoints.length > 0){
			jQuery(".childInfo").append(jQuery("<a>").attr({"href":"javascript:;","class":"drop_points"}).html("drop points"));
		}

		if(pickupPoints.length > 0){
			jQuery(".childInfo").append(jQuery("<a>").attr({"href":"javascript:;","class":"pickup_points"}).html("pickup points"));
		}


		jQuery(".childInfo").append(jQuery("<div>").addClass("points_list"));
		child.bindActions();
	},

	bindActions: function(){
		jQuery(".container").on("click",".childInfo .drop_points",function(e){
			e.preventDefault();
			var _this = e.target;
			jQuery(".points_list").empty();
			child.createDropPointsList();
		});
		jQuery(".container").on("click",".childInfo .pickup_points",function(e){
			e.preventDefault();
			var _this = e.target;
			jQuery(".points_list").empty();
			child.createPickupPointsList();
		});

		jQuery(".container").on("click",".drop_points_list .address_point",function(e){
			e.preventDefault();
			var _this = e.target;
			var dropPointId = _this.getAttribute("drop_id");
			child.getDropPoint(dropPointId);
		});

		jQuery(".container").on("click",".pickup_points_list .address_point",function(e){
			e.preventDefault();
			var _this = e.target;
			var pickupPointId = _this.getAttribute("pickup_id");
			child.getPickupPoint(pickupPointId);
		});

		jQuery(".container").on("click",".addPickUpPoint a",function(e){
			e.preventDefault();
			child.creatPointsForm("pick_up");
			
		});

		jQuery(".container").on("click",".addDropPoint a",function(e){
			e.preventDefault();
			child.creatPointsForm("drop");
		});

		jQuery(".container").on("click",".childInfo form a#submitPoints",function(e){
			e.preventDefault();
			var _this = e.target;
			var formClass = _this.parentNode.classList;
			if(formClass == "pick_up"){
				child.addPickUpPoint();
			}else if(formClass == "drop"){
				child.addDropPoint();
			}
		});

		jQuery('.container').on("click",".points_list .track_point",function(e){
			e.preventDefault();
			var type,point_id;
			var _this = e.target;
			var _directParent = _this.parentNode;
			var _directList = _directParent.parentNode.classList;
			var _pointEle = _directParent.querySelector('.address_point');
			if(_directList == "drop_points_list"){
				type = "drop";
				point_id = _pointEle.getAttribute("drop_id");
			}else if(_directList == "pickup_points_list"){
				type = "pickup";
				point_id = _pointEle.getAttribute("pickup_id");
			}
			child.getTrip(type,point_id);
		});
	},

	createDropPointsList: function(){
		var childId = jQuery(".childItem.active").attr("child-id");
		var addressObj = JSON.parse(storage.fetchItem("address_"+childId));
		var drop_points = addressObj.drop_points;

		var list = jQuery("<ul>").addClass("drop_points_list");
		for(var i=0;i<drop_points.length;i++){
			var dropPoint = jQuery("<a>").attr({"href":"javascript:;","class":"address_point"});
			dropPoint.html(drop_points[i].name);
			dropPoint.attr("drop_id",drop_points[i].drop_point_id);
			if(drop_points[i].primary){
				dropPoint.addClass("primary");
			}
			var listItem = jQuery("<li>");
			listItem.append(dropPoint);
			listItem.append(jQuery('<a>').attr({'href':'javascript:;','class':'track_point'}).html('Track Point'));
			list.append(listItem);
		}

		jQuery(".points_list").append(list);

		var addDropPoint = jQuery("<div>").addClass("addDropPoint");
		addDropPoint.append(jQuery("<a>").attr({"href":"javascript:;"}).html("add Drop point"));
		
		jQuery(".points_list").append(addDropPoint);
	},

	createPickupPointsList: function(){
		var childId = jQuery(".childItem.active").attr("child-id");
		var addressObj = JSON.parse(storage.fetchItem("address_"+childId));
		var pickup_points = addressObj.pickup_points;

		var list = jQuery("<ul>").addClass("pickup_points_list");
		for(var i=0;i<pickup_points.length;i++){
			var pickupPoint = jQuery("<a>").attr({"href":"javascript:;","class":"address_point"});
			pickupPoint.html(pickup_points[i].name);
			pickupPoint.attr("pickup_id",pickup_points[i].pickup_point_id);
			if(pickup_points[i].primary){
				pickupPoint.addClass("primary");
			}
			var listItem = jQuery("<li>");
			listItem.append(pickupPoint);
			listItem.append(jQuery('<a>').attr({'href':'javascript:;','class':'track_point'}).html('Track Point'));
			list.append(listItem);
		}

		jQuery(".points_list").append(list);

		var addPickUpPoint = jQuery("<div>").addClass("addPickUpPoint");
		addPickUpPoint.append(jQuery("<a>").attr({"href":"javascript:;"}).html("add pickUp point"));
		
		jQuery(".points_list").append(addPickUpPoint);
	},

	getDropPoint: function(dropPointId){
		var payload = 'id='+dropPointId,
			headers = {};
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('getDropPoint','GET',child.dropPointSuccess,child.dropPointFail, payload, headers);
	},
	
	dropPointSuccess: function(response){
		var appartment_number = response.appartment_number,
			building_number = response.building_number,
			latitude = response.latitude,
			longitude = response.longitude,
			name = response.name,
			province = response.province_id,
			street_name = response.street_name,
			student_id = response.student_id;



		var pointContainer = jQuery("<table>").addClass("pointContainer");
		var tableHeader = jQuery("<th>");
		tableHeader.append(jQuery("<td>").html("student_id"));
		tableHeader.append(jQuery("<td>").html("appartment_number"));
		tableHeader.append(jQuery("<td>").html("building_number"));
		tableHeader.append(jQuery("<td>").html("latitude"));
		tableHeader.append(jQuery("<td>").html("longitude"));
		tableHeader.append(jQuery("<td>").html("name"));
		tableHeader.append(jQuery("<td>").html("province"));
		tableHeader.append(jQuery("<td>").html("street_name"));
		pointContainer.append(tableHeader);

		var tableContent = jQuery("<tr>");
		tableContent.append(jQuery("<td>").html(student_id));
		tableContent.append(jQuery("<td>").html(appartment_number));
		tableContent.append(jQuery("<td>").html(building_number));
		tableContent.append(jQuery("<td>").html(latitude));
		tableContent.append(jQuery("<td>").html(longitude));
		tableContent.append(jQuery("<td>").html(name));
		tableContent.append(jQuery("<td>").html(province));
		tableContent.append(jQuery("<td>").html(street_name));
		pointContainer.append(tableContent);

		jQuery(".points_list").append(pointContainer);
		console.log(response);
	},

	dropPointFail: function(response){
		console.log(response);
	},

	getPickupPoint: function(pickupPointId){
		var payload = 'id='+pickupPointId,
			headers = {};
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('getPickupPoint','GET',child.pickupPointSuccess,child.pickupPointFail, payload, headers);
	},

	pickupPointSuccess: function(response){
		var appartment_number = response.appartment_number,
			building_number = response.building_number,
			latitude = response.latitude,
			longitude = response.longitude,
			name = response.name,
			province = response.province_id,
			street_name = response.street_name,
			student_id = response.student_id;

		var pointContainer = jQuery("<table>").addClass("pointContainer");
		var tableHeader = jQuery("<th>");
		tableHeader.append(jQuery("<td>").html("student_id"));
		tableHeader.append(jQuery("<td>").html("appartment_number"));
		tableHeader.append(jQuery("<td>").html("building_number"));
		tableHeader.append(jQuery("<td>").html("latitude"));
		tableHeader.append(jQuery("<td>").html("longitude"));
		tableHeader.append(jQuery("<td>").html("name"));
		tableHeader.append(jQuery("<td>").html("province"));
		tableHeader.append(jQuery("<td>").html("street_name"));
		pointContainer.append(tableHeader);

		var tableContent = jQuery("<tr>");
		tableContent.append(jQuery("<td>").html(student_id));
		tableContent.append(jQuery("<td>").html(appartment_number));
		tableContent.append(jQuery("<td>").html(building_number));
		tableContent.append(jQuery("<td>").html(latitude));
		tableContent.append(jQuery("<td>").html(longitude));
		tableContent.append(jQuery("<td>").html(name));
		tableContent.append(jQuery("<td>").html(province));
		tableContent.append(jQuery("<td>").html(street_name));

		pointContainer.append(tableContent);
		
		jQuery(".points_list").append(pointContainer);

		console.log(response);
	},

	pickupPointFail: function(response){
		console.log(response);
	},


	creatPointsForm: function(point_type){

		var form = jQuery("<form>");
		form.addClass(point_type);
		var array = ["appartment_number","building_number","latitude","longitude","name","primary","province_id","street_name","student_id"]
		
		for(var i=0;i<array.length;i++){
			var fieldSet = jQuery("<fieldset>");
			fieldSet.append("<label>").html(array[i]);
			if(array[i] == "primary"){
				fieldSet.append(jQuery("<input>").attr({"type":"checkbox","id":array[i]}));
			}else{
				fieldSet.append(jQuery("<input>").attr({"type":"text","id":array[i]}));	
			}
			form.append(fieldSet);
		}
		
		form.append(jQuery("<a>").attr({"href":"javascript:;","id":"submitPoints"}).html("Submit"));


		jQuery(".childInfo").append(form);
	},

	addPickUpPoint: function(){
		var payload = {},
			appartment_number = jQuery('#appartment_number').val(),
			building_number = jQuery('#building_number').val(),
			latitude = jQuery('#latitude').val(),
			longitude = jQuery('#longitude').val(),
			name = jQuery('#name').val(),
			primary = document.getElementById('primary').checked,
			province_id = jQuery('#province_id').val(),
			street_name = jQuery('#street_name').val(),
			student_id = jQuery('.childrenList .childItem.active').attr("child-id"),
			address_id = jQuery('.childrenList .childItem.active').attr("child-address");

		if(appartment_number.length < 0 || building_number.length < 0 ||  latitude.length < 0 || longitude.length < 0 || name.length < 0 || province_id.length < 0 || street_name.length < 0){
			alert("all fields should be filled");
			return;
		}

	
		payload.appartment_number = appartment_number;
		payload.building_number = building_number;

		payload.latitude = latitude;
		payload.longitude = longitude;
		payload.name = name;
		payload.primary = primary;
		payload.province_id = province_id;
		payload.street_name = street_name;
		payload.student_id = student_id;
		payload.address_id = address_id;

		payload = JSON.stringify(payload);
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('addPickupPoint','POST',child.addPickUpPointSuccess,child.addPickUpPointFail, payload);

	},

	addPickUpPointSuccess: function(response){
		console.log(response);
	},
	addPickUpPointFail: function(response){
		console.log(response);
	},

	addDropPoint: function(){
		var payload = {},
			appartment_number = jQuery('#appartment_number').val(),
			building_number = jQuery('#building_number').val(),
			latitude = jQuery('#latitude').val(),
			longitude = jQuery('#longitude').val(),
			name = jQuery('#name').val(),
			primary = document.getElementById('primary').checked,
			province_id = jQuery('#province_id').val(),
			street_name = jQuery('#street_name').val(),
			student_id = jQuery('.childrenList .childItem.active').attr("child-id"),
			address_id = jQuery('.childrenList .childItem.active').attr("child-address");

		if(appartment_number.length < 0 || building_number.length < 0 ||  latitude.length < 0 || longitude.length < 0 || name.length < 0 || province_id.length < 0 || street_name.length < 0){
			alert("all fields should be filled");
			return;
		}

	
		payload.appartment_number = appartment_number;
		payload.building_number = building_number;

		payload.latitude = latitude;
		payload.longitude = longitude;
		payload.name = name;
		payload.primary = primary;
		payload.province_id = province_id;
		payload.street_name = street_name;
		payload.student_id = student_id;
		payload.address_id = address_id;

		payload = JSON.stringify(payload);
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('addDropPoint','POST',child.addDropPointSuccess,child.addDropPointFail, payload);

	},
	addDropPointSuccess: function(response){
		console.log(response);
	},
	addDropPointFail: function(response){
		console.log(response);
	},

	getTrip: function(type,pointId){
		var headers = {},
			payload = 'type='+type+'&pointId='+pointId;

		requestHandler.sendRequest('getTripByPoint','GET',child.getTripSuccess,child.getTripFail, payload, headers);
	},

	getTripSuccess: function(response){
		console.log(response);
		var _trip = response.trip;
		var busId = _trip.bus;

		child.generateIOConnection(busId);
	},

	getTripFail: function(response){
		console.log(response);
	},


	generateIOConnection: function(busId){
		//http://stackoverflow.com/questions/13143945/dynamic-namespaces-socket-io
		// var nameSpace = '/bus/'+busId;
		// return io.connect(nameSpace, {
  //      		query: 'ns='+nameSpace+'&token='+JSON.parse(storage.fetchItem("token")),
  //      		resource: "socket.io",
  //   	});

	
		window.socket = io('http://localhost:3100/bus/'+busId,{
			query: 'ns=http://localhost:3100/bus/'+busId+'&token='+JSON.parse(storage.fetchItem("token")),
			resource: "socket.io"
		});

		window.socket.on('connection',function(socket){
			console.log("user socket ready");
		});

		window.socket.on('push-tracking',function(data){
    		console.log("data recieved from server");
    		console.log(data);
    	});



		// window.busSocket = io.connect('http://localhost:3100/bus');
		// busSocket.on('connection',function(socket){
		// 	console.log("socket ready");
		// });
		// busSocket.on("data",function(data){
		// 	console.log('data === '+ data);
		// });

		//socket.emit('tracking-bus',"testing bus connection from users");

		// socket.on('connection',function(socket){
		// 	console.log("connected to socket");
			

	 //    	socket.on('disconnect', function(){
		// 	   console.log('user disconnected');
		// 	});

	 //    	socket.emit('tracking-bus',"testing bus connection from users");
		// });
		
	}

}





var bus = {
	init: function(){
		bus.drawAvailableTrips();
		bus.bindButtonsAction();
	},

	bindButtonsAction: function(){
		jQuery(".container").on("click",".available-trips .trip-link",function(e){
			e.preventDefault();
			var _this = e.target;
			var tripId = _this.getAttribute("ref-id");
			bus.getTrip(tripId);
		});
	},

	drawAvailableTrips: function(){
		var userObj = JSON.parse(storage.fetchItem("user"));
		var availableTrips = userObj.trips;
		var tripName,tripType,tripId,tripRecord,
			tripsContainer = jQuery("<div>").addClass("available-trips"),
			dropTrips = jQuery("<div>").addClass("drop-trips"),
			pickupTrips = jQuery("<div>").addClass("pickup-trips");

		for(var i=0;i<availableTrips.length;i++){
			tripName = availableTrips[i].name;
			tripType = availableTrips[i].type;
			tripId = availableTrips[i].trip_id;
			tripRecord = jQuery("<div>").addClass("trip-record");
			if(tripType == "drop" ){
				tripRecord.append(jQuery("<a>").attr({"href":"javascript:;","class": "trip-link drop-trip","ref-id":tripId}).html(tripName));
				dropTrips.append(tripRecord);
				tripsContainer.append(dropTrips);
			}else if(tripType == "pickup"){
				tripRecord.append(jQuery("<a>").attr({"href":"javascript:;","class": "trip-link pickup-trip","ref-id":tripId}).html(tripName));
				pickupTrips.append(tripRecord);
				tripsContainer.append(pickupTrips);
			}
		}
		jQuery(".container").append(tripsContainer);
	},

	getTrip: function(tripId){
		var payload = 'id='+tripId,
			headers = {};
		//service, method, sCallback, fCallback, payload, headers, arg
		requestHandler.sendRequest('getTrip','GET',bus.tripSuccess,bus.tripFail, payload, headers);
	},

	tripSuccess: function(response){
		console.log(response);
		var tripObj = response.trip;
		var tripRecord = jQuery("<div>").addClass("trip-container");
		var item = jQuery("<div>");
		item.append(jQuery("<span>").html("name : "));
		item.append(jQuery("<span>").html(tripObj.name));
		tripRecord.append(item);

		var item1 = jQuery("<div>");
		item1.append(jQuery("<span>").html("bus : "));
		item1.append(jQuery("<span>").html(tripObj.bus));
		tripRecord.append(item1);


		var item2 = jQuery("<div>");
		item2.append(jQuery("<span>").html("active : "));
		item2.append(jQuery("<span>").html(tripObj.active));
		tripRecord.append(item2);



		var item3 = jQuery("<div>");
		item3.append(jQuery("<span>").html("bus_teacher : "));
		item3.append(jQuery("<span>").html(tripObj.bus_teacher));
		tripRecord.append(item3);

		if(tripObj.type == "drop"){
			var item4 = jQuery("<div>");
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("name"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("longitude"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("latitude"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("drop_id"));
			tripRecord.append(item4);

			for(var i=0;i<tripObj.drop_points.length;i++){
				var item5 = jQuery("<div>");
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.drop_points[i].name));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.drop_points[i].longitude));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.drop_points[i].latitude));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.drop_points[i].drop_id));
				tripRecord.append(item5);
			}
			
		}else if(tripObj.type == "pickup"){
			var item4 = jQuery("<div>");
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("name"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("longitude"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("latitude"));
			item4.append(jQuery("<span>").attr("style","width:25%;display:inline-block;font-weight: bold;").html("pickup_id"));
			tripRecord.append(item4);

			for(var i=0;i<tripObj.pickup_points.length;i++){
				var item5 = jQuery("<div>");
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.pickup_points[i].name));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.pickup_points[i].longitude));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.pickup_points[i].latitude));
				item5.append(jQuery("<span>").attr("style","width:25%;display:inline-block;").html(tripObj.pickup_points[i].pickup_id));
				tripRecord.append(item5);
			}
			
		}

		jQuery(".container").append(tripRecord);

	},

	tripFail: function(response){
		alert("check console for errors");
		console.log(response);
	}
}




var testFunc = function(){
	
}
function testFuncSuccess(res){
	console.log(res);
}
function testFuncFail(res){
	console.log(res);
}


jQuery(document).ready(function(){
	login.init();
});