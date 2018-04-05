$(document).ready(function() {
  var id = getParameterByName('id')
  $("#backIdInput").val(id);


  // get information about the user
  $.ajax({
    url: "http://localhost:4000/user/" + id + "/name/",
    // data: {"id": userID, "team": team},
    datatype: "json",
    method: "GET",
    error: function(){
      console.log("error occured")
    },
    success: function(data, status){
        document.getElementById("name").innerHTML = data.name
    }
  })

  // get user's favorites
  $.ajax({
    url: "http://localhost:4000/user/" + id + "/favorite",
    datatype: "json",
    method: "GET",
    error: function(){
      console.log("error occured")
    console.log("get users favorite with id " + id)
    },
    success: function(data, status){
    console.log("get users favorite with id " + id)
    	favorites = data.favorite
	    // append a table to html body to show favorite teams
	    appendTableFavorites(favorites)
	    // add a click to button on each row of the table
	    for (let i = 0; i < favorites.length; i++) {
	    	favorite = favorites[i]
            console.log(favorite)
	      $('#' + (i + 1) + "Button").click(function() {
            console.log("clicked")
            console.log(this.id)
	      	deleteTeam(id, favorite)
            $("#" + (i + 1) + "Tr").remove()
	      })
	    }
    }
  })

  // add a click to reset button
  $("#resetButton").click(function(){
  	var newName = document.getElementById("newNameInput").value
	// update user's name
  	$.ajax({
	    url: "http://localhost:4000/user/" + id + "/name",
	    data: {"newName": newName},
	    datatype: "json",
	    method: "PUT",
	    error: function(){
	      console.log("error occured")
	    },
	    success: function(data, status){
            console.log(data)
            document.getElementById("name").innerHTML = data.newName
	    }
  	})
  })

})


// append a table of favorite teams to body and hide it
// favorites, json from server
function appendTableFavorites(favorites) {
  // append a table to body
  $("<table id='favoriteTable'></table>").appendTo('body')
  console.log("appended a favorites table to body")

  // add first row
  var firstRow = '<tr><th>' + "Team Name" + '</th><th>' + "Remove" + '</th></tr>'
  $(firstRow).appendTo('#favoriteTable');

  // loop through players and add each row
  for (let j = 0; j < favorites.length; j++) {
    var favorite = favorites[j]
    var row = '<tr id="' + (j+1) + 'Tr" ><td>' + favorite + '</td><td><button id="' + (j+1) + 'Button">-</button></td></tr>'
    $(row).appendTo('#favoriteTable');
  }
}

// delete team from user's favorites
function deleteTeam(id, teamName){
    console.log("deleteTeam called")
  $.ajax({
    url: "http://localhost:4000/user/" + id + "/favorite/" + teamName,
    datatype: "json",
    method: "DELETE",
    error: function(){
      console.log("error occured")
    },
    success: function(data, status){
    	console.log("delete success")
        console.log(data)
    }
  })
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
