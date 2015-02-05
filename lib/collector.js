'use strict';

var path = require('path');
var init = require('./initializer');


var Collector = function(collector) {

    var isActive = false;
    var that = this;

    var sysConfig = init.getConfig();
    var config = init.getConfig(collector);

    var worker = require(path.resolve(sysConfig.path.collectors, collector));
    var handler = require('./handler/' + sysConfig.handler.type);


    function start() {
        isActive = true;
        collect(collector, config);
    }

    function collect(collector) {
        setTimeout(function(){
            worker(that, config);
            if(isActive) {
                collect(collector, config);
            }
        }, config.interval || 5000);
    }

    function stop() {
        isActive = false;
    }

    this.publish = function(type, metric) {

        console.log('publish', metric);

        handler.process(metric);

    };

    this.publish_gauge = function() {


    };

    this.publish_counter = function() {


    };


    this.start = start;
    this.stop = stop;
    this.sysConfig = sysConfig;
    this.config = config;

};

module.exports = Collector;
