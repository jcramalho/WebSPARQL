var express = require('express')
var router = express.Router()
var Lexer = require('lex')

// -------------------Word Count------------------
var lex_wc = new Lexer
var linhas=0, palavras=0, chars=0
lex_wc.addRule(/(\r\n)|\n/, function(){
    linhas++
    chars++
}).addRule(/\w+/, function(lexema){
    chars += lexema.length
    palavras++
}).addRule(/./, function(){
    chars++
})
// ------------------Soma on/off------------------
var lex_soma = new Lexer
var soma=0, flag=1
var strSoma = ""
lex_soma.addRule(/(\r\n)|\n/, function(){
    strSoma += "\n"
}).addRule(/=/, function(){
    strSoma += "\nSOMA: " + soma + "\n"
}).addRule(/\d+/, function(lexema){
    if(flag) soma += parseInt(lexema)
}).addRule(/!off!/, function(){
    flag = 0
}).addRule(/!on!/, function(){
    flag = 1
})
.addRule(/###/, function(){
    soma = 0
})
.addRule(/./, function(lexema){
    strSoma += lexema
})
// ------------------XML------------------
var lex_xml = new Lexer
var strText = ""
var abertura = 0
var fecho = 0
lex_xml.addRule(/(\r\n)|\n/, function(){
    strText += "\n"
}).addRule(/<[a-zA-Z0-9 "_\-]+>/, function(){
    abertura++
}).addRule(/<\/[a-zA-Z0-9= "_\-]+>/, function(){
    fecho++
}).addRule(/./, function(lexema){
    strText += lexema
})
// ------------------Tratamento dos pedidos-------
/* GET users listing. */
router.get('/input', function(req, res, next) {
  res.render('getInput')
})

router.post('/input', function(req, res, next){
    console.log(JSON.stringify(req.body))
    if(req.body.comp == "1"){
        lex_wc.setInput(req.body.intext)
        lex_wc.lex()
        var resultado = {"text":"linhas: "+linhas+", palavras: "+palavras+", chars: "+chars+"\n"}
        linhas = 0
        palavras = 0
        chars = 0
        console.log(JSON.stringify(resultado))
        res.json(resultado)
    }
    else if(req.body.comp == "2"){
        lex_soma.setInput(req.body.intext)
        lex_soma.lex()
        var resultado = {"text":strSoma}
        strSoma = ""
        soma= 0
        console.log(JSON.stringify(resultado))
        res.json(resultado)
    }
    else if(req.body.comp == "3"){
        lex_xml.setInput(req.body.intext)
        lex_xml.lex()
        var resultado = {"text": "Tags de abertura: "+abertura+", Tags de fecho: "+fecho+"\n"+strText}
        strText = ""
        abertura = 0
        fecho = 0
        console.log(JSON.stringify(resultado))
        res.json(resultado)
    }
    else
        res.json({"comp": "Unknown..."})
})

module.exports = router;
