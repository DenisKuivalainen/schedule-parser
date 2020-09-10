const HTML = require('node-html-parser')
const fetch = require('node-fetch');


fetch('https://schedule.nspu.ru/group_shedule.php?id=1424')
    .then(function (response) {
        switch (response.status) {
            case 200:
                return response.text();

            case 404:
                throw response;
        }
    })
    .then(function (layout) {
        let eist = HTML.parse(layout).childNodes[1].childNodes[10];


        let a = eist
        console.log(a)
    }).catch(e => {
        return
    })