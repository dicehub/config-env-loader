var fs = require('fs');
var path = require('path');
var Yaml = require('yaml').default;
var outputConfig = {};

function merge(cfg) {
  if (!cfg) {
    return;
  }

  for (var prop in cfg) {
    outputConfig[prop] = cfg[prop];
  }
}

function getFileContent(path) {
  try {
    return Yaml.parse(
      fs.readFileSync(
        path,
        { encoding: 'utf-8' }
      )
    );
  }

  catch(e) {
    return null;
  }
}

function mergeFile(path) {
  var content = getFileContent(path);

  if (content) {
    merge(content);
  }
}

module.exports = function(options) {
  var dirname = path.dirname(module.parent.filename);
  var env = process.env.NODE_ENV || 'local';

  if (options.include) {
    for (var filename of options.include) {
      mergeFile(path.resolve(dirname, filename));
    }
  }

  mergeFile(path.resolve(dirname, options.configPath, `${env}.yaml`));

  for (var variable in outputConfig) {
    process.env[variable] = outputConfig[variable];
  }

  return outputConfig;
};
