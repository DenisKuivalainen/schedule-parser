const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const port = process.env.PORT || 8080;

const app = express();
 
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/*', function (req, res) {
    fetch('https://schedule.nspu.ru/group_shedule.php?id=1139')
    .then(function (response) {
        switch (response.status) {
            // status "OK"
            case 200:
                return response.text();
            // status "Not Found"
            case 404:
                throw response;
        }
    })
    .then(function (template) {
        console.log(template);
        res.send("hello")
        console.log("-----------------------------------------");
        console.log("-----------------------------------------");
        console.log("-----------------------------------------");
    })
    .catch(function (response) {
        // "Not Found"
        console.log(response.statusText);
    });
});

app.listen(port);