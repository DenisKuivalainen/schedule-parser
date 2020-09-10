const express = require('express');
const path = require('path');
const parser = require('./requestSchedule');

const port = process.env.PORT || 8080;

const app = express();
 
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/schedule', function (req, res) {
    parser.parseHTML(req.query.id)
    .then(layout => parser.getLinesOfParsedValues(layout))
    .then(values => (parser.getObjectOfParsedValues(values)))
    .then(response => res.send({
        operated: true,
        data: response
    }))
    .catch(e => {
        res.send({
            operated: false
        });
    });
});

app.get('/*', function (req, res) {
    res.send('Here should be WEB page...');
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);