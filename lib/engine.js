'use stirct';

var _ = require('lodash');
var init = require('./initializer');
var Collector = require('./collector');
var config = init.getConfig();

var Engine = function() {

    var collectorsQueue = {};

    function start() {
        _.forEach(config.collectors, function(collector){
            collectorsQueue[collector] = new Collector(collector);
            collectorsQueue[collector].start();
        });
    }

    function stop(collector) {
        collectorsQueue[collector].stop();
    }


    this.start = start;
    this.stop = stop;

};

module.exports = new Engine;
