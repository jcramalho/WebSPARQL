$(function(){
    $("#intext").val("")
    $("#proc").click(function(){
      var textSource = {"intext": $("#intext").val()}
      $.ajax({
          type: 'POST',
          data: textSource,
          url: '/sparql/input',
          dataType: 'JSON'
      }).done(function(response){
        var html = "<pre>"
        for (var key in response.results.bindings) {
            html += response.results.bindings[key].cod.value + '\n'
        }
        //html += JSON.stringify(response.results.bindings)
        html += "</pre>"

        $("#resultado").append(html)
      })
    })

    $("#limpa").click(function(){
        $("#resultado").children().remove()
    })

    $("#novo").click(function(){
        $("#intext").val("")
    })
})

    