/**
 * Copyright (c) 2015 C. Brett Witherspoon
 */

var spawn = require('child_process').spawn

module.exports = function () {
    args = ['octave'
           ,'--quiet'
           ,'--no-gui'
           ,'--traditional'
           ,'--no-history']
    this._child = spawn('sandbox', args)

    this.stdin = this._child.stdin
    this.stdout = this._child.stdout
    this.stderr = this._child.stderr

    this._child.on('error', function (error) {
        console.error('interpreter: %s', error)
    })
    .on('exit', function (code, signal) {
        console.info('interpreter: exit: code=%s signal=%s', code, signal)
    })
}

