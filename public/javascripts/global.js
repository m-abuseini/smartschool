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
			    	}else{
			    		form.append(jQuery("<input>").attr({"name":key,"value": list[i][key],"disabled":"disabled"}));
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
			    jQuery("#wrapper").append("<br>");

			  }
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
			formHandler.formAvailableForms = document.querySelectorAll("#"+formContainer+" section.hidden-form");
			
			formHandler.initFormNavigation();
		},

		initRecord: function(rContainer,rButtonsContainer){
			formHandler.recordContainer = document.querySelector("#"+ rContainer);
			formHandler.recordButtonsContainer = document.querySelector("."+rButtonsContainer);
			formHandler.recordsMainContainer = document.querySelector("#wrapper");
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
				var formClass = button.children[0].classList;
				formClass = formClass.toString();
				formClass = formClass.replace(/add-form /g,'');
				console.log(formClass);
				[].forEach.call(formHandler.formAvailableForms, function(el) {
					if(el.classList.contains(formClass)){
						el.classList.add("selected");
					}else{
						el.classList.remove("selected");
					}
				});
			}else{
				button.classList.remove("current");
			}
		},

		recordButtonHandler: function(e){
			var button = e.delegateTarget;
			if(button.classList.contains("deleteRecord")){
				formHandler.enableDeleterecordBehavior(button);
			}else if(button.classList.contains("editRecord")){
				formHandler.enableEditrecordBehavior(button);
			}else if(button.classList.contains("updateRecord")){
				formHandler.enableUpdateRecordBehavior(button);
			}
		},
		

		enableDeleterecordBehavior: function(button){
			
			var record = button.parentElement.parentNode;
			var recordId = record.id;
			if(record.nodeName !== "FORM" ){return;}
			// set a request for sending the request to delete through api

				// on success of removal
				formHandler.recordsMainContainer.removeChild(record);
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
			console.log("Update Form");
		},


		buttonsFilter: function(elem) { return elem.classList && elem.classList.contains("btn"); },

}

	jQuery("document").ready(function(){
	  formSetter();
	});