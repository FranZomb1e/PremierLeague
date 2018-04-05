$(document).ready(function() {
	$("#loginForm").hide()
  $("#signupForm").hide()
	$("#signupText").hide()
  $("#loginButton").hide()

  // use jquery's hide() and show() to interact with the page
  $("#loginText").click(function() {
	  $("#signupText").show()
	  $("#loginText").hide()
    $("#loginButton").show()
    $("#signupButton").hide()
    $("#nameInput").hide()
  })

  $("#signupText").click(function() {
	  $("#loginText").show()
	  $("#signupText").hide()
    $("#loginButton").hide()
    $("#signupButton").show()
    $("#nameInput").show()
  })

  $("#signupButton").click(function(){
    var name = document.getElementById("nameInput").value
    var id = document.getElementById("idInput").value
    $.ajax({
      url: "http://localhost:4000/signup",
      data: {"id": id, "name": name},
      datatype: "json",
      method: "POST",
      error: function(){
        console.log("error occured")
      },
      success: function(data, status){
        if (data.status == "0"){
          $("#signupIdInput").val(id)
          $("#signupForm").submit()
        }
        else if (data.status == "1"){
          $("#alert").remove();
          var body = document.body
          var p = document.createElement("p")
          p.innerText = "User ID already exists"
          p.id = "alert"
          body.append(p)
        }
        else if (data.status == "2"){
          $("#alert").remove();
          var body = document.body
          var p = document.createElement("p")
          p.innerText = "The inputs can not be empty"
          p.id = "alert"
          body.append(p)
        }
      }
    })
  })


  $("#loginButton").click(function(){
    var id = document.getElementById("idInput").value
    $.ajax({
      url: "http://localhost:4000/login",
      data: {"id": id},
      datatype: "json",
      method: "POST",
      error: function(){
        console.log("error occured")
      },
      success: function(data, status){
        console.log(data)
        if (data.status == "0"){
          console.log("user id exist, log in successful")
          $("#loginIdInput").val(id)
          $("#loginForm").submit()
        }
        else if (data.status == "1"){
          $("#alert").remove();
          var body = document.body
          var p = document.createElement("p")
          p.innerText = "User ID does not exist"
          p.id = "alert"
          body.append(p)
        }
        else if (data.status == "2"){
          $("#alert").remove();
          var body = document.body
          var p = document.createElement("p")
          p.innerText = "The input can not be empty"
          p.id = "alert"
          body.append(p)
        }
      }
    })
  })
})
