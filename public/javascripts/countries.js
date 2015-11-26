// countryList Data array for filling in info box
var countryListData = [];

// Dom Ready ----------------------------------------------------------------------------------
jQuery(document).ready(function(){
	//populate country table on initial page load
	populateData();
	
	//country link click
	jQuery('#countryList table tbody').on('click','td a.linkshowcountry',showcountryInfo);
	
	// add country click
	//jQuery('#btnAddcountry').on('click',addcountry);

	// delete country click
	jQuery('#countryList table tbody').on('click','td a.linkdeletecountry', deletecountry);

	//update country click
	jQuery('#countryList table tbody').on('click','td a.linkUpdatecountry', getcountryDataToUpdate);

	// add country click
	//jQuery('#btnUpdatecountry').on('click',updatecountry);
}); 

// functions ----------------------------------------------------------------------------------

// fill table with data
function populateData(){

	//empty content string
	var table = '';

	// jQuery AJAX call for JSON
	jQuery.getJSON('/api/countrys/countryList',function(data){

		//for each item in JSON, add a table row and cells to connect the string 
		jQuery.each(data,function(){

			// countrylist global variable 
			countryListData = data;

			table += '<tr>';
			table += '<td><a href="#" class="linkshowcountry" rel="'+this.name+'">' +this.name+ '</a></td>';
			table += '<td>' +this.arabicname+ '</td>';
			table += '<td>' +this.countrycode+ '</td>';
			table += '<td>' +this.abbreviationtwoletters+ '</td>';
			table += '<td>' +this.abbreviationthreeletters+ '</td>';
			table += '<td><a href="#" class="linkdeletecountry" rel="' +this._id+ '">delete</a></td>';
			table += '<td><a href="#" class="linkUpdatecountry" rel="' +this._id+ '">update</a></td>';
			table += '<tr>';
		});

		jQuery('#countryList table tbody').html(table);
	});
};

// show country Info
function showcountryInfo(event){
	//prevent link from firing 
	event.preventDefault();

	// retrieve name from link rel attribute
	var thisname = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = countryListData.map(function(arrayItem){return arrayItem.name}).indexOf(thisname);

	// get country object
	var thiscountryObject = countryListData[arrayPosition];

	//populate info box
	jQuery('#countryInfoName').text(thiscountryObject.name);
	jQuery('#countryInfoArabicName').text(thiscountryObject.arabicname);
	jQuery('#countryInfoCountryCode').text(thiscountryObject.countrycode);
	jQuery('#countryInfoAbbreviationTwoLetters').text(thiscountryObject.abbreviationtwoletters);
	jQuery('#countryInfoAbbreviationThreeLetters').text(thiscountryObject.abbreviationthreeletters);

};

// Delete country 
function deletecountry(event){
	event.preventDefault();

	jQuery.ajax({
		type: 'DELETE',
		url: 'api/countrys/deletecountry/'+jQuery(this).attr('rel')
	}).done(function(response){
		if(response.msg === ''){
		}else{
			alert('error = '+ response.msg);
		}

		populateData();
	});
}

//Get country Data To Update
function getcountryDataToUpdate(e){
	e.preventDefault();

	// retrieve name from link rel attribute
	var thisname = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = countryListData.map(function(arrayItem){return arrayItem._id}).indexOf(thisname);

	// get country object
	var thiscountryObject = countryListData[arrayPosition];

	//populate info box
	jQuery('#countryId').val(thiscountryObject._id);
	jQuery('#updatecountryName').val(thiscountryObject.name);
	jQuery('#updatecountryArabicName').val(thiscountryObject.arabicname);
	jQuery('#updateUcountryCountryCode').val(thiscountryObject.countryInfoCountryCode);
	jQuery('#updatecountryAbbreviationTwoLetters').val(thiscountryObject.abbreviationtwoletters);
	jQuery('#updatetcountryAbbreviationThreeLetters').val(thiscountryObject.abbreviationthreeletters);
};