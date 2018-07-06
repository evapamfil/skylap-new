const express = require('express'),
    fs = require('fs'),
    Papa = require('papaparse'),
    router = express.Router();

//const bagage = [],
//    services = [],
//    présentation = []

/* GET home page. */
router.get('/:company', function (req, res, next) {
    let file = fs.createReadStream('public/csv/data.csv')
    let company = req.params.company
    console.log(company)
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let comp of results.data) {
                //console.log(comp)
                if (comp['nom de la compagnie'] == company) {
                    //todo: get dynamique un text par section
                    res.render('landing', {
                        iata: comp.IATA,
                        company: comp['nom de la compagnie'],
                        cabine: comp['poid cabine'],
                        soute: comp['Poids max. autoris� des bagages en soute'],
                        bagagemain: comp['Taille du bagage � main'],
                        wifi: comp['WIFI'],
                        service: comp[' Services � bord'],
                        name: comp['Nom complet'],
                        date: comp['Date de cr�ation'],
                        nationality: comp['Nationalit�'],
                        base: comp['Si�ge Social '],
                        siege: comp['A�roport de base'],
                        number: comp['num�ro de t�l�phone'],
                        website: comp['Site Web'],
                        taillesoute: comp['taille soute']
                    })
                }
            }
        }
    })
});


module.exports = router;
