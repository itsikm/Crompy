'use strict';

var path    = require('path');
var exec    = require('child_process').exec;
var os      = require('os');
var async   = require('async');
var numeral = require('numeral');

/**
 * Diskspace
 * * *
 * @param config
 * @constructor
 */
var Diskspace = function(config) {

    /**
     * Execute a command to retrieve disks list.
     *
     * @param command
     * @param fnCallback
     */
    function _getDrives(command, fnCallback) {
        exec(command, function (err, stdout, stderr) {
                if (err) return fnCallback(err);
                var drives = stdout.split('\n');

                drives.splice(0, 1);
                drives.splice(-1, 1);

                // Removes ram drives
                drives = drives.filter(function(item){ return item != "none"});
                fnCallback(null, drives);
            }
        );
    }

    /**
     * Execute a command.
     *
     * @param command
     * @param callback
     */
    function _getDetail(command, callback) {
        exec(command, function (err, stdout, stderr) {
                if (err) return callback(err);
                callback(null, parseInt(stdout) * 1024);
            }
        );
    }

    /**
     * Execute a command.
     *
     * @param command
     * @param callback
     */
    function _getDetailNaN(command, callback) {
        exec(command, function (err, stdout, stderr) {
                if (err) return callback(err);
                callback(null, stdout);
            }
        );
    }

    /**
     * Retrieve disks list.
     *
     * @param fnCallback
     */
    function drives( fnCallback ) {
        switch (os.platform().toLowerCase()) {
            case 'linux':
            default:
                _getDrives('df | awk \'{print $1}\'', fnCallback);
        }
    }

    /**
     * Retrieve space information about each drives.
     *
     * @param drives
     * @param callback
     */
    function drivesDetail(drives, callback) {
        var drivesDetail = [];

        async.eachSeries(
            drives,
            function (drive, cb) {
                driveDetail(
                    drive,
                    function (err, detail) {
                        if (err) return cb(err);
                        drivesDetail.push(detail);
                        cb();
                    }
                );
            },
            function (err) {
                if (err) return callback(err);
                callback(null, drivesDetail);
            }
        );
    }

    /**
     * Retrieve space information about one drive.
     *
     * @param drive
     * @param callback
     */
    function driveDetail(drive, callback) {
        async.series(
            {
                used: function (callback) {
                    switch (os.platform().toLowerCase()) {
                        case'darwin':
                            _getDetail('df -kl | grep ' + drive + ' | awk \'{print $3}\'', callback);
                            break;
                        case'linux':
                        default:
                            _getDetail('df | grep ' + drive + ' | awk \'{print $3}\'', callback);
                    }
                },
                available: function (callback) {
                    switch (os.platform().toLowerCase()) {
                        case'darwin':
                            _getDetail('df -kl | grep ' + drive + ' | awk \'{print $4}\'', callback);
                            break;
                        case'linux':
                        default:
                            _getDetail('df | grep ' + drive + ' | awk \'{print $4}\'', callback);
                    }
                },
                mountpoint: function (callback) {
                    switch (os.platform().toLowerCase()) {
                        case'darwin':
                            _getDetailNaN('df -kl | grep ' + drive + ' | awk \'{print $9}\'', function(e, d){
                                if (d) d = d.trim();
                                callback(e, d);
                            });
                            break;
                        case'linux':
                        default:
                            _getDetailNaN('df | grep ' + drive + ' | awk \'{print $6}\'', function(e, d){
                                if (d) d = d.trim();
                                callback(e, d);
                            });
                    }
                }
            },
            function (err, results) {
                if (err) return callback(err);
                results.freePer = numeral(results.available / (results.used + results.available) * 100).format('0');
                results.usedPer = numeral(results.used / (results.used + results.available) * 100).format('0');
                results.total = numeral(results.used + results.available).format('0.00 b');
                //results.used = numeral(results.used).format('0.00 b');
                //results.available = numeral(results.available).format('0.00 b');
                results.drive = drive;

                callback(null, results);
            }
        );
    }

    this.drives = drives;
    this.drivesDetail = drivesDetail;
    this.driveDetail = driveDetail;

};

module.exports = Diskspace;
