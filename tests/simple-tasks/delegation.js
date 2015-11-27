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


var formHandler = {
	
	formNavigation : null,
	formNavigationButtons: null,
	formContainer : null,
	formAvailableForms: null,
	
	init: function(formNav,formContainer){
		formHandler.formNavigation = document.querySelector("#"+formNav);
		formHandler.formNavigationButtons = document.querySelectorAll("#"+formNav+" ul li.btn");
		formHandler.formContainer  = document.querySelector("#"+formContainer);
		formHandler.formAvailableForms = document.querySelectorAll("#"+formContainer+" section.hidden-form");
		
		formHandler.initFormNavigation();
	},
	
	initFormNavigation: function(){
		formHandler.formNavigation.addEventListener("click", delegate(formHandler.buttonsFilter, formHandler.buttonHandler));
	},
	
	buttonHandler: function(e) {
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
	
	buttonsFilter: function(elem) { return elem.classList && elem.classList.contains("btn"); },

}

jQuery(document).ready(function(){
	formHandler.init("submit-forms-nav","form-container");
});