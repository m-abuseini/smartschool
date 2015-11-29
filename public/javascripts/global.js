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

	jQuery("document").ready(function(){
		// navigation requires #navigationcontainer[id], #formContainer[id]
		formHandler.initNavigation("forms-navigation","wrapper");
	  	//formSetter();
	  	bindAddrecordButton();
	});