'use strict';

var fs = require('fs');
var path = require('path');
var Yaml = require('yaml').default;

function merge(cfg, outputConfig) {
  if (!cfg) {
    return;
  }

  for (var prop in cfg) {
    outputConfig[prop] = cfg[prop];
  }
}

function getFileContent(path, isThrow) {
  try {
    var fileContent = fs.readFileSync(path, { encoding: 'utf-8' });

    if (!fileContent) {
      return;
    }

    return Yaml.parse(fileContent);
  } catch (e) {
    if (isThrow) {
      throw e;
    }

    return null;
  }
}

function mergeFile(path, outputConfig, isThrow) {
  var content = getFileContent(path, isThrow);

  if (content) {
    merge(content, outputConfig);
  }
}

module.exports = function(options) {
  if (!options) {
    return;
  }

  var outputConfig = {};
  var dirname = path.dirname(module.parent.filename);
  var env = process.env.NODE_ENV || 'local';

  if (options.include) {
    options.include.forEach(function(filename) {
      mergeFile(path.resolve(dirname, filename), outputConfig, true);
    });
  }

  if (options.configPath) {
    mergeFile(
      path.resolve(dirname, options.configPath, env + '.yaml'),
      outputConfig
    );
  }

  for (var variable in outputConfig) {
    process.env[variable] = outputConfig[variable];
  }

  return outputConfig;
};
