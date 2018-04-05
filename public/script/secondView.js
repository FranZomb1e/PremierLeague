$(document).ready(function() {

  const scriptPath = './public/script/'

  var userID = getParameterByName('id');
  $("#idInput").val(userID);

  $.ajax({
    url: "http://localhost:4000/user/" + userID + "/name/",
    // data: {"id": userID, "team": team},
    datatype: "json",
    method: "GET",
    error: function(){
      console.log("error occured")
    },
    success: function(data, status){
        document.getElementById("favoriteSubmit").value = data.name
    }
  })

  $('#hide').hide()
  $('#back').hide()

  // load all the data at the beginning and use a callback to do other operations
  loadData(200, function(data) {
    console.log("loaded all data")
    console.log(data)

    // append all tables to body at once
    leagueTable = data[0]
    playersList = data[1]
    appendTableRank(leagueTable)
    for (let i = 0; i < playersList.length; i++) {
      players = playersList[i]
      appendTablePlayers(players)
    }

    // use jquery's hide() and show() to interact with the page
    $("#show").click(function() {
      $('#tableRank').show()
      $('#show').hide()
      $('#hide').show()
    })

    $('#hide').click(function() {
      $('#tableRank').hide()
      $('#show').show()
      $('#hide').hide()
    })

    $('#back').click(function() {
      document.getElementsByTagName('h1')[0].innerHTML = '2017/18'
      $('h2').show()
      $('#hide').show()
      $('#back').hide()
      $('#tableRank').show()
      $('.tablePlayers').hide()
    })

    for (let i = 0; i < playersList.length; i++) {
      $('#' + (i + 1)).click(function() {
        players = playersList[i]
        document.getElementsByTagName('h1')[0].innerHTML = players['teamName']
        $('h2').hide()
        $('#tableRank').hide()
        $('#table' + (i + 1)).show()
        $('#hide').hide()
        $('#back').show()
      })
    }

    for (let i = 0; i < playersList.length; i++) {
      $('#' + (i + 21)).click(function() {
        var trs = document.getElementsByTagName("tr")[i+1];
        var team = trs.cells[1].innerHTML;
        console.log(userID);
        console.log("test add: " + team);

	// add a new team to user's favorites
        $.ajax({
          url: "http://localhost:4000/user/" + userID + "/favorite/" + team,
          // data: {"id": userID, "team": team},
          datatype: "json",
          method: "POST",
          error: function(){
            console.log("error occured")
          },
          success: function(data, status){
            if (data == "0"){
              console.log("finally add success");
            }
            else {
              console.log("something wrong");
            }
          }
        })
      })
    }
  })
})


// load leagueTable and playersList got from api
// timeout: to deal with server's access control
// callback: to operate on loaded data
function loadData(timeout, callback) {
  console.log("started")
  // use a promise to ensure we get the league table first before anything else
  let leaguTablePromise = new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        'X-Auth-Token': 'ee846dbea58c4df7b037d1e2e2b76959'
      },
      type: 'GET',
      url: 'http://api.football-data.org/v1/competitions/445/leagueTable',
      success: function(data) {
        resolve(data)
      }
    })
  })

  leaguTablePromise.then((leagueTable) => {
    console.log("got leagueTable")
    console.log(leagueTable)
    var standing = leagueTable['standing']
    console.log("got standing")
    console.log(standing)

    // set a timeout to reduce the frequency of get request
    // bacause the server has access control
    // create a promise for each players json we need to get from server
    // use a timeout promise to ensure we get all players promises before use Promise.all
    let timeoutPromise = new Promise((resolve, reject) => {
      playersPromiseList = []
      num = standing.length
      for (let i = 0; i < num; i++) {
        setTimeout(function() {
          var team = standing[i]

          let playersPromise = new Promise((resolve, reject) => {
            console.log(i)
            $.ajax({
              headers: {
                'X-Auth-Token': 'ee846dbea58c4df7b037d1e2e2b76959'
              },
              type: 'GET',
              url: team['_links']['team']['href'] + '/players',
              success: function(data) {
                // put team position and name info into players json
                data['position'] = team['position']
                data['teamName'] = team['teamName']
                resolve(data)
                console.log("got one players list")
                console.log(data)
              }
            })
          })

          playersPromiseList.push(playersPromise)
          console.log("show playersPromiseList")
          console.log(playersPromiseList)
          if (i == num - 1) {
            resolve(playersPromiseList)
          }
        }, i * timeout)
      }
    })

    // when promise is resolved, use callback to operate on loaded data
    timeoutPromise.then((playersPromiseList) => {
      Promise.all(playersPromiseList).then((playersList) => {
        console.log('got all players lists')
        console.log(playersList)
        callback([leagueTable, playersList])
      }).catch(reason => {
        console.log('some get request got rejected from server')
      })
    })
  })
}


// append a table to body and hide it
// leagueTable, json loaded from api
function appendTableRank(leagueTable) {
  var standing = leagueTable['standing']
  // append a table to body
  $('<table id="tableRank"></table>').appendTo('body')
  $('#tableRank').hide()
  console.log("appended rank table to body")

  // add first row
  var firstRow = '<tr> <th>Rank</th> <th>Team</th>' +
    '<th>playedGames</th> <th>wins</th> <th>losses</th>' +
    '<th>draws</th> <th>goalDifference</th> <th>Points</th>' +
    '<th>players</th><th>Add to List</th></tr>'
  $(firstRow).appendTo('#tableRank')

  // loop through leagueTable and add each row
  for (let i = 0; i < standing.length; i++) {

    var team = standing[i]
    var row = '<tr><td>' + team.position + '</td><td id = "team">' + team.teamName +
      '</td><td>' + team.playedGames + '</td><td>' + team.wins +
      '</td><td>' + team.losses + '</td><td>' + team.draws +
      '</td><td>' + team.goalDifference + '</td><td>' + team.points +
      '</td><td><button id=' + team.position + ' class = "buttonPlayers">' + "+" + '</button>'
      +'</td><td><button id=' + (i+21) + ' class = ' + team.teamName  + '>' + "+" + '</button></td></tr>'
    $(row).appendTo('#tableRank');

  }
}


// append a table to body and hide it
// players, json loaded from api
function appendTablePlayers(players) {
  // append a table to body
  $('<table id=table' + players.position + ' class=tablePlayers></table>').appendTo('body')
  $('#table' + players.position).hide()
  console.log("appended a players table to body")

  // add first row
  var firstRow = '<tr><th>' + "name" + '</th><th>' + "nationality" +
    '</th><th>' + "position" + '</th><th>' + "jerseyNumber" +
    '</th><th>' + "dateOfBirth" + '</th></tr>'
  $(firstRow).appendTo('#table' + players.position);

  // loop through players and add each row
  for (let j = 0; j < players.players.length; j++) {
    var player = players.players[j]
    var row = '<tr><td>' + player.name + '</td><td>' + player.nationality +
      '</td><td>' + player.position + '</td><td>' + player.jerseyNumber +
      '</td><td>' + player.dateOfBirth + '</td></tr>'
    $(row).appendTo('#table' + players.position);
  }
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
