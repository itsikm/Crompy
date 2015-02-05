'use strict';

var Diskspace = require('./diskspace');

module.exports = function(collector, config) {

    var discspace = new Diskspace(config);

    discspace.drives(function(err, drives){
        discspace.drivesDetail(drives, function(err, drivesDetail){
            collector.publish('diskspace.used', drivesDetail[0].used);
            collector.publish('diskspace.available', drivesDetail[0].available);
        });
    });

};
