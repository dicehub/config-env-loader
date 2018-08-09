var fs = require('fs');
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
  var env = process.env.NODE_ENV || 'local';

  if (options.include) {
    for (var path of options.include) {
      mergeFile(path);
    }
  }

  mergeFile(`${options.configPath}${env}.yaml`);

  for (var variable in outputConfig) {
    process.env[variable] = outputConfig[variable];
  }

  return outputConfig;
};
