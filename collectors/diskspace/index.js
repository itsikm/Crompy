'use strict';

var Diskspace = require('./diskspace');

module.exports = function(collector, config) {

    var discspace = new Diskspace(config);

    discspace.drives(function(err, drives){
        discspace.drivesDetail(drives, function(err, drivesDetail){
            collector.publish('COUNTER', drivesDetail);
        });
    });

};
