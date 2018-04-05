document.getElementById("signup").addEventListener("click",function(){
  fetch("move/createUser").then(
    function(response){
      if(response.status !== 200){
        console.err(err)
        return
      }
    })
      // response.json().then(function(result) {
      //   const article = document.querySelector('#article ul')
      //   result.forEach((link) => {
      //     var li = document.createElement('li')
      //     var anchor = document.createElement('a')
      //     li.appendChild(anchor)
      //     anchor.href =  link.url
      //     anchor.innerText = link.titile
      //     article.appendChild(li)
      //   })
        
      // })
});
