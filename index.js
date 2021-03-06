'use strict';

var fs = require('fs');
var path = require('path');
var Yaml = require('yaml');

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
    if (e.name === 'YAMLSemanticError') {
      console.error(e.message);
    }

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
  var env = process.env.NODE_ENV || 'development';

  if (options.include) {
    options.include.forEach(function(filename) {
      var filePath = path.isAbsolute(filename) ? filename : path.resolve(dirname, filename);

      mergeFile(filePath, outputConfig, true);
    });
  }

  if (options.configPath) {
    var generalFile = path.resolve(dirname, options.configPath, 'common.yaml');
    if (fs.existsSync(generalFile)) {
      mergeFile(generalFile, outputConfig);
    }

    var filePath = path.isAbsolute(options.configPath)
      ? path.resolve(options.configPath, env + '.yaml')
      : path.resolve(dirname, options.configPath, env + '.yaml');

    mergeFile(filePath, outputConfig);
  }

  for (var variable in outputConfig) {
    process.env[variable] = outputConfig[variable];
  }

  return outputConfig;
};
