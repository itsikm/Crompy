#!/usr/bin/env node

'use strict';

var program = require('commander');
var path = require('path');
var packageInfo = require(path.resolve('package.json'));

var engine = require('../lib/engine');

process.title = 'crompy';

// Program Version
program.version(packageInfo.version);

program.command('start')
    .description('Start collecting data')
    .action(engine.start);

program.command('new [name]')
    .description('create new collector project')
    .action(function(name){

        console.log('New ' + name);

    });

// Program Parse
program.parse(process.argv);
