var HTML = require('node-html-parser')
const fetch = require('node-fetch');

fetch('https://schedule.nspu.ru/group_shedule.php?id=1139')
.then(function (response) {
    switch (response.status) {
        // status "OK"
        case 200:
            return response.text();
        // status "Not Found"
        case 404:
            console.log(1);
            throw response;
    }
})
.then(function (layout) {
    let elementWithTables = HTML.parse(layout).childNodes[1].childNodes[6].childNodes[0];

    let timetableArray = [];

    elementWithTables.childNodes[4].childNodes.forEach(element => {
        if(element.tagName !== undefined) {
            timetableArray.push(element);
        }
    });

    let stringArray = [];

    // console.log(timetableArray[6].childNodes[0].rawAttrs)

    for (let i = 0; i < timetableArray.length; i++) {

        for (let j = 0; j < timetableArray[i].childNodes.length; j++) {

            if(timetableArray[i].childNodes[j] !== undefined) {
                //var rawAttrs = timetableArray[i].childNodes[j].rawAttrs.indexOf(colspan=2) ? i + "-" + j + "-" + 1;

                for (let k = 0; k < timetableArray[i].childNodes[j].childNodes.length; k++) {

                    if(timetableArray[i].childNodes[j].childNodes[k] !== undefined && timetableArray[i].childNodes[j].childNodes[k].rawText !== '') {
                        stringArray.push([timetableArray[i].childNodes[j].childNodes[k].rawText, i]);
                    }           
                }
            }
        }
    }

    console.log(stringArray);

    // return stringArray;
})
// .then(function(htmlValues) {

// })