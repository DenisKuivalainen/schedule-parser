const HTML = require('node-html-parser');
const fetch = require('node-fetch');

async function parseHTML(id) {
    return fetch('https://schedule.nspu.ru/group_shedule.php?id=' + id)
    .then(function (response) {
        switch (response.status) {
            case 200:
                return response.text();

            case 404:
                throw response;
        }
    })
}

function getLinesOfParsedValues(layout) {
    let elementsInScheduleTable = HTML.parse(layout).childNodes[1].childNodes[6].childNodes[0].childNodes[4];
    let notNullInScheduleTable = [];
    let stringArray = [HTML.parse(layout).childNodes[1].childNodes[6].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[1].rawText];
    let positionArray =[[0, 0]];

    elementsInScheduleTable.childNodes.forEach(element => {
        if(element.tagName !== undefined) {
            notNullInScheduleTable.push(element);
        }
    });

    
    for (let i = 0; i < notNullInScheduleTable.length; i++) {

        if(notNullInScheduleTable[i] !== undefined) {

            for (let j = 0; j < notNullInScheduleTable[i].childNodes.length; j++) {

                if(notNullInScheduleTable[i].childNodes[j] !== undefined) {

                    for (let k = 0; k < notNullInScheduleTable[i].childNodes[j].childNodes.length; k++) {

                        if(notNullInScheduleTable[i].childNodes[j].childNodes[k] !== undefined && notNullInScheduleTable[i].childNodes[j].childNodes[k].rawText !== '') {
                            stringArray.push(notNullInScheduleTable[i].childNodes[j].childNodes[k].rawText);
                            positionArray.push([i, j]);
                        }           
                    }
                }
            }
        }
    }

    return [stringArray, positionArray];
}

function getObjectOfParsedValues(scheduleValues) {
    let modnayPosition = scheduleValues[0].indexOf('Понедельник ');
    let tuesdayPosition = scheduleValues[0].indexOf('Вторник ');
    let wednesdayPosition = scheduleValues[0].indexOf('Среда ');
    let thursdayPosition = scheduleValues[0].indexOf('Четверг ');
    let fridayPosition = scheduleValues[0].indexOf('Пятница ');
    let saturdayPosition = scheduleValues[0].indexOf('Суббота ');

    return {
        group: scheduleValues[0][0],
        week: scheduleValues[0][1].indexOf(',') !== -1,
        days: {
            monday: getDatSchedule(modnayPosition, tuesdayPosition, scheduleValues),
            tuesday: getDatSchedule(tuesdayPosition, wednesdayPosition, scheduleValues),
            wednesday: getDatSchedule(wednesdayPosition, thursdayPosition, scheduleValues),
            thursday: getDatSchedule(thursdayPosition, fridayPosition, scheduleValues),
            friday: getDatSchedule(fridayPosition, saturdayPosition, scheduleValues),
            saturday: getDatSchedule(saturdayPosition, scheduleValues[0].length, scheduleValues),
        }
    }
}

function getDatSchedule(day1, day2, arr) {
    let sArr = arr[0]; // array of values
    let cArr = arr[1]; // array of element codes
    let cur = day1 + 1;

    let outputArr = [];

    while(true) {
        let time = replaceChars(sArr[cur]);
        let subjects = [];
        cur += 1;

        while(cur < day2) {
            let name = deleteLastComma(replaceChars(sArr[cur])); // subject name
            let desc = ''; // subject description
            let code = cArr[cur][1];
    
            cur += 1;

            if(cur === day2) {
                subjects.push({name: name, desc: desc, code: code});
                break;
            }
            
            while(cArr[cur][1] === cArr[cur - 1][1]) {
                desc += replaceChars(sArr[cur]);
                cur += 1;
                if(sArr[cur - 1].lastIndexOf(';') >= 0) {break;}
            }

            subjects.push({name: name, desc: desc, code: code});
            if(cArr[cur][0] !== cArr[cur - 1][0]) {break;}
        }

        outputArr.push({time: time, subjects: subjects});
        if(cur === day2) {break;}
    }

    return outputArr;
}

function replaceChars(str) {
    return str.replace('&nbsp', '').replace('\r', '').replace(';', '')
}

function deleteLastComma(str) {
    let commaIndex = str.lastIndexOf(',')
    return str.substr(0, commaIndex >= 0 ? commaIndex: str.length);
}

module.exports = {parseHTML, getLinesOfParsedValues, getObjectOfParsedValues};