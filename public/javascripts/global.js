//global.js

// UserList Data array for filling in info box
var userListData = [];

// Dom Ready ----------------------------------------------------------------------------------
jQuery(document).ready(function(){

	//populate user table on initial page load
	populateData();

	//user link click
	jQuery('#userList table tbody').on('click','td a.linkshowuser',showUserInfo);
	
	// add user click
	jQuery('#btnAddUser').on('click',addUser);

	// delete user click
	jQuery('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);

	//update user click
	jQuery('#userList table tbody').on('click','td a.linkUpdateUser', getUserDataToUpdate);

	// add user click
	jQuery('#btnUpdateUser').on('click',updateUser);
}); 

// functions ----------------------------------------------------------------------------------

// fill table with data
function populateData(){

	//empty content string
	var table = '';

	// jQuery AJAX call for JSON
	jQuery.getJSON('/api/users/userList',function(data){

		//for each item in JSON, add a table row and cells to connect the string 
		jQuery.each(data,function(){

			// userlist global variable 
			userListData = data;

			table += '<tr>';
			table += '<td><a href="#" class="linkshowuser" rel="'+this.username+'">' +this.username+ '</a></td>';
			table += '<td>' +this.email+ '</td>';
			table += '<td><a href="#" class="linkdeleteuser" rel="' +this._id+ '">delete</a></td>';
			table += '<td><a href="#" class="linkUpdateUser" rel="' +this._id+ '">update</a></td>';
			table += '<tr>';
		});

		jQuery('#userList table tbody').html(table);
	});
};

// show user Info
function showUserInfo(event){
	//prevent link from firing 
	event.preventDefault();

	// retrieve username from link rel attribute
	var thisUserName = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem){return arrayItem.username}).indexOf(thisUserName);

	// get user object
	var thisUserObject = userListData[arrayPosition];

	//populate info box
	jQuery('#userInfoName').text(thisUserObject.fullname);
	jQuery('#userInfoAge').text(thisUserObject.age);
	jQuery('#userInfoGender').text(thisUserObject.gender);
	jQuery('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event){
	event.preventDefault();

	//basic validation
	var errorCount = 0;
	jQuery('#addUser input').each(function(index, val){
		if(jQuery(this).val() === ''){errorCount++;}
	});

	// check error count == 0
	if(errorCount === 0){

		var newUser = {
			'username': jQuery('#addUser fieldset input#inputUserName').val(),
			'email': jQuery('#addUser fieldset input#inputUserEmail').val(),
			'fullname': jQuery('#addUser fieldset input#inputUserFullname').val(),
			'age': jQuery('#addUser fieldset input#inputUserAge').val(),
			'location': jQuery('#addUser fieldset input#inputUserLocation').val(),
			'gender': jQuery('#addUser fieldset input#inputUserGender').val()
		}

		//Use Ajax to post object to our addUser service
		jQuery.ajax({
			type: 'POST',
			data: newUser,
			url: 'api/users/adduser',
			datatype: 'JSON'
		}).done(function(response){

			//check if successfull response (blank)
			if(response.msg === ''){

				//clear form Inputs
				jQuery('#addUser fieldset input').val('');

				//repopulate Data
				populateData();
			}else{
				alert('error : '+ response.msg);
			}
		})

	}else{

		//empty fields
		alert('please fill in all fields');
		return false;
	}
};

// Delete User 
function deleteUser(event){
	event.preventDefault();

	jQuery.ajax({
		type: 'DELETE',
		url: 'api/users/deleteuser/'+jQuery(this).attr('rel')
	}).done(function(response){
		if(response.msg === ''){
		}else{
			alert('error = '+ response.msg);
		}

		populateData();
	});
}

//Get User Data To Update
function getUserDataToUpdate(e){
	e.preventDefault();

	// retrieve username from link rel attribute
	var thisUserName = jQuery(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem){return arrayItem._id}).indexOf(thisUserName);

	// get user object
	var thisUserObject = userListData[arrayPosition];

	//populate info box
	jQuery('#userId').val(thisUserObject._id);
	jQuery('#updateUserName').val(thisUserObject.username);
	jQuery('#updateUserEmail').val(thisUserObject.email);
	jQuery('#updateUserFullname').val(thisUserObject.fullname);
	jQuery('#updateUserAge').val(thisUserObject.age);
	jQuery('#updateUserGender').val(thisUserObject.gender);
	jQuery('#updateUserLocation').val(thisUserObject.location);
};

function updateUser(e){
	e.preventDefault();

	//basic validation
	var errorCount = 0;
	jQuery('#editUser input').each(function(index, val){
		if(jQuery(this).val() === ''){errorCount++;}
	});

	// check error count == 0
	if(errorCount === 0){

		var newUser = {
			'_id': jQuery('#editUser fieldset input#userId').val(),
			'username': jQuery('#editUser fieldset input#updateUserName').val(),
			'email': jQuery('#editUser fieldset input#updateUserEmail').val(),
			'fullname': jQuery('#editUser fieldset input#updateUserFullname').val(),
			'age': jQuery('#editUser fieldset input#updateUserAge').val(),
			'location': jQuery('#editUser fieldset input#updateUserLocation').val(),
			'gender': jQuery('#editUser fieldset input#updateUserGender').val()
		}

		//Use Ajax to post object to our addUser service
		jQuery.ajax({
			type: 'POST',
			data: newUser,
			url: 'api/users/updateuser',
			datatype: 'JSON'
		}).done(function(response){

			//check if successfull response (blank)
			if(response.msg === ''){

				//clear form Inputs
				jQuery('#editUser fieldset input').val('');

				//repopulate Data
				populateData();
			}else{
				alert('error : '+ response.msg);
			}
		})

	}else{

		//empty fields
		alert('please fill in all fields');
		return false;
	}
};