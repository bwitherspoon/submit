/*
 * Copyright (c) 2015 C. Brett Witherspoon
 */

var http = require('http')
var Interpreter = require('./interpreter')

var style = ['      header {'
            ,'        text-align: center;'
            ,'      }'
            ,'      main {'
            ,'        margin: 0% 25%;'
            ,'      }'
            ].join('\n')

var script = ['      function handleFiles(files) {'
             ,'        var file = files[0]'
             ,'        var res = document.getElementById(\'result\')'
             ,'        var req = new XMLHttpRequest()'
             ,'        req.onload = function () {'
             ,'            res.innerHTML = req.responseText'
             ,'        }'
             ,'        req.open(\'POST\', \'/\')'
             ,'        req.setRequestHeader(\'Content-Type\', \'text/plain\')'
             ,'        req.setRequestHeader(\'Accept\', \'text/plain\')'
             ,'        req.send(file)'
             ,'      }'
             ].join('\n')

var index = ['<!DOCTYPE html>'
            ,'<html>'
            ,'  <head>'
            ,'    <title>Submit</title>'
            ,'    <style type="text/css">'
            ,       style
            ,'    </style>'
            ,'    <script>'
            ,       script
            ,'    </script>'
            ,'  </head>'
            ,'  <body>'
            ,'    <header>'
            ,'      <h1>Submit your *.m</h1>'
            ,'    </header>'
            ,'    <main>'
            ,'      <input type="file" id="code" accept=".m" onchange="handleFiles(this.files)"/>'
            ,'      <pre><output id="result" for="code"></output></pre>'
            ,'    </main>'
            ,'  </body>'
            ,'</html>'
            ].join('\n')

module.exports = http.createServer(function (req, res) {
    if (req.url != '/') {
        res.writeHead(404, { Connection: 'close' })
        res.end('404 Not Found')
        return
    }
    if (req.method == 'GET')
        res.end(index)
    else if (req.method == 'POST') {
        if (req.headers['content-type'] == 'text/plain') {
            var interpreter = new Interpreter()
            req.pipe(interpreter.stdin)
            interpreter.stdout.pipe(res)
            interpreter.stderr.pipe(process.stderr)
        } else {
            res.writeHead(400, { Connection: 'close' })
            res.end('400 Bad Request')
        }
    }
})
