// schoolList Data array for filling in info box
var schoolListData = [];

// Dom Ready ----------------------------------------------------------------------------------
jQuery(document).ready(function(){
	//populate school table on initial page load
	populateData();
	
	//school link click
	jQuery('#schoolList table tbody').on('click','td a.linkshowschool',showschoolInfo);
	
	// add school click
	//jQuery('#btnAddschool').on('click',addschool);

	// delete school click
	jQuery('#schoolList table tbody').on('click','td a.linkdeleteschool', deleteschool);

	//update school click
	jQuery('#schoolList table tbody').on('click','td a.linkUpdateschool', getschoolDataToUpdate);

	// add school click
	//jQuery('#btnUpdateschool').on('click',updateschool);
}); 

// functions ----------------------------------------------------------------------------------

// fill table with data
function populateData(){

	//empty content string
	var table = '';

	// jQuery AJAX call for JSON
	jQuery.getJSON('/api/schools/schoolList',function(data){

		//for each item in JSON, add a table row and cells to connect the string 
		jQuery.each(data,function(){

			// schoollist global variable 
			schoolListData = data;

			table += '<tr>';
			table += '<td><a href="#" class="linkshowschool" rel="'+this.name+'">' +this.name+ '</a></td>';
			table += '<td>' +this.email+ '</td>';
			table += '<td><a href="#" class="linkdeleteschool" rel="' +this._id+ '">delete</a></td>';
			table += '<td><a href="#" class="linkUpdateschool" rel="' +this._id+ '">update</a></td>';
			table += '<tr>';
		});

		jQuery('#schoolList table tbody').html(table);
	});
};

// show school Info
function showschoolInfo(event){
	//prevent link from firing 
	event.preventDefault();

	// retrieve name from link rel attribute
	var thisname = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = schoolListData.map(function(arrayItem){return arrayItem.name}).indexOf(thisname);

	// get school object
	var thisschoolObject = schoolListData[arrayPosition];

	//populate info box
	jQuery('#schoolInfoName').text(thisschoolObject.fullname);
	jQuery('#schoolInfoemail').text(thisschoolObject.email);
	jQuery('#schoolInfoGender').text(thisschoolObject.gender);
	jQuery('#schoolInfoLogourl').text(thisschoolObject.logourl);
	jQuery('#schoolInfoDescription').text(thisschoolObject.description);
	jQuery('#schoolnIfopassword').text(thisschoolObject.password);

};

// Delete school 
function deleteschool(event){
	event.preventDefault();

	jQuery.ajax({
		type: 'DELETE',
		url: 'api/schools/deleteschool/'+jQuery(this).attr('rel')
	}).done(function(response){
		if(response.msg === ''){
		}else{
			alert('error = '+ response.msg);
		}

		populateData();
	});
}

//Get school Data To Update
function getschoolDataToUpdate(e){
	e.preventDefault();

	// retrieve name from link rel attribute
	var thisname = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = schoolListData.map(function(arrayItem){return arrayItem._id}).indexOf(thisname);

	// get school object
	var thisschoolObject = schoolListData[arrayPosition];

	//populate info box
	jQuery('#schoolId').val(thisschoolObject._id);
	jQuery('#updateschoolName').val(thisschoolObject.name);
	jQuery('#updateschoolEmail').val(thisschoolObject.email);
	jQuery('#updateUschoollogourl').val(thisschoolObject.logourl);
	jQuery('#updateschoolDescription').val(thisschoolObject.description);
	jQuery('#updatetschoolGender').val(thisschoolObject.gender);
};