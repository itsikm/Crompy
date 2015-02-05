'use strict';

var Influx = require('influx');

var InfluxdbHandler = function() {

    var client,
        that = this;

    this.connect = function(config) {

        console.log('influx connect', config);

        client = Influx(config);


        console.log('influx client', client);
        return that;
    };

    function post(metric) {
        client.writePoint(metric.path, metric.points());
        console.log('writePoint:', metric.path, metric.points());
    }

    this.post = post;
};


module.exports = new InfluxdbHandler;

