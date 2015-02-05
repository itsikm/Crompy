'use strict';

var path = require('path');
var init = require('./initializer');
var Metric = require('./metric');


var Collector = function(collector) {

    var isActive = false;
    var that = this;

    var sysConfig = init.getConfig();
    var config = init.getConfig(collector);

    var worker = require(path.resolve(sysConfig.path.collectors, collector));
    var handler = require('./handler/' + sysConfig.handler.type).connect(sysConfig.handler.config);


    function start() {
        isActive = true;
        collect(collector, config);
    }

    function collect(collector) {
        worker(that, config);
        if(isActive) {
            setTimeout(function(){
                collect(collector, config);
            }, config.interval || 5000);
        }
    }

    function stop() {
        isActive = false;
    }

    this.publish = function(path, value, options) {
        var metric = new Metric(path, value, options || {});
        handler.post(metric);
    };

    this.publish_gauge = function(name, value) {


    };

    this.publish_counter = function() {


    };


    this.start = start;
    this.stop = stop;
    this.sysConfig = sysConfig;
    this.config = config;

};

module.exports = Collector;
