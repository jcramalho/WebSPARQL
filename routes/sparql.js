var express = require('express')
var router = express.Router()

const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://epl.di.uminho.pt:40003/repositories/m51-clav-jcr'
const myupdateEndpoint = 'http://epl.di.uminho.pt:40003/repositories/m51-clav-jcr/statements'

var client = new SparqlClient( endpoint, {updateEndpoint: myupdateEndpoint, 
                                          defaultParameters: {format: 'json'}})
        .register({
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            clav: 'http://jcr.di.uminho.pt/m51-clav#',
            owl: 'http://www.w3.org/2002/07/owl#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            noInferences: 'http://www.ontotext.com/explicit'
        })

// ------------------Tratamento dos pedidos-------
/* GET users listing. */
router.get('/input', function(req, res, next) {
  res.render('getInput')
})

router.post('/input', function(req, res, next){
    var query = req.body.intext
    client.query(query)
        .execute()
        .then(function (qres) {
            console.log('\n\n\n')
            console.log(JSON.stringify(qres))
            res.json(qres)
        })
        .catch(function (error) {
            console.log('ERRO: ' + error)
    })
})

module.exports = router;
