#!/usr/bin/env node

var spawn = require('cross-spawn');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var conf = require('@dicehub/config-env-loader')({
  configPath: argv.configPath,
  include: argv.include
});

var spawnArgs = [];
for (var i = 1; i < argv._.length; i++) {
  spawnArgs.push(argv._[i]);
}

for (var prop in argv) {
  if (['configPath', 'include', '_'].indexOf(prop) !== -1) {
    continue;
  }

  spawnArgs.push(prop);
  spawnArgs.push(argv[prop]);
}

spawn(argv._[0], spawnArgs, { stdio: 'inherit' })
  .on('exit', exitCode => process.exit(exitCode));
