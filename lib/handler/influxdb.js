'use strict';

var Influx = require('influx');

var InfluxdbHandler = function() {

    var client = null;

    this.init = function(config) {
        client = influx(config);
    };

    this.connect = function() {

        client = influx(config);
    };

    function process(data) {

        console.log('InfluxDB POST:', data);

        //client.writePoint()
    }

    this.process = process;

};


module.exports = new InfluxdbHandler;

