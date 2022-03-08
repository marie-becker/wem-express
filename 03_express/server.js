const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload')
const app = express();
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Merge Files</title>\n' +
        '</head>\n' +
        '<body style="font-family: Calibri">\n' +
        '<h2>Wählen Sie zwei Dateien zum Mergen aus.</h2>\n' +
        '<form enctype="multipart/form-data" method="POST" action="/upload">\n' +
        '    <input name="first" type="file">\n' +
        '    <input name="second" type="file">\n' +
        '    <input type="submit">\n' +
        '</form>\n' +
        '</body>\n' +
        '</html>')
})

app.post('/upload', function (req, res) {
    let first = req.files.first.data.toString('utf8').split("\n");
    let second = req.files.second.data.toString('utf8').split("\n");
    const text = interleave(first, second).join('\n');
   fs.writeFile('mergedResult.txt', text, function (err) {
        if (err) throw err;
    });
    res.send(`<h2 style="font-family: Calibri">Die Ergebnisdatei kann 
    <a href="/download" target="_blank">hier</a> heruntergeladen werden und hat folgenden Inhalt:</h2>` + text);
})

app.get('/download', function(req, res){
    const file = "mergedResult.txt";
    res.download(file)
})


// interleave function taken from Mulan on stackoverflow
// https://stackoverflow.com/a/47061616/15212696
const interleave = ([x, ...xs], ys = []) =>
    x === undefined
        ? ys                             // base: no x
        : [x, ...interleave(ys, xs)]     // inductive: some x

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})