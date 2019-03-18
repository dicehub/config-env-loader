const ENV = Object.assign({}, process.env);

function cleanEnv() {
  // Clean ENV
  for (let prop in process.env) {
    if (!ENV.hasOwnProperty(prop)) {
      delete process.env[prop];
    }
  }

  delete process.env.NODE_ENV;
}

beforeEach(() => {
  cleanEnv();
});

describe('Load configurations', () => {
  test('Load development config if NODE_ENV is not defined', () => {
    delete process.env.NODE_ENV;

    require(('../index'))({
      configPath: '../config',
    });

    expect(process.env.DEVELOPMENT_ENV_VAR).toEqual('42');
  });

  test('Load development config if NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';

    require(('../index'))({
      configPath: '../config',
    });

    expect(process.env.DEVELOPMENT_ENV_VAR).toEqual('42');
  });

  test('Load production config if NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';

    require(('../index'))({
      configPath: '../config',
    });

    expect(process.env.PRODUCTION_ENV_VAR).toEqual('42');
  });

  test('Load only exact same config as NODE_ENV', () => {
    process.env.NODE_ENV = 'development';

    var a = require(('../index'))({
      configPath: '../config',
    });

    expect(process.env.DEVELOPMENT_ENV_VAR).toEqual('42');
    expect(process.env.PRODUCTION_ENV_VAR).toEqual(undefined);
  });

  test('Load general config', () => {
    require(('../index'))({
      configPath: '../config'
    });

    expect(process.env.GENERAL_ENV_VAR).toEqual('42');
    expect(process.env.DEVELOPMENT_ENV_VAR).toEqual('42');
  });

  test('Load additional config', () => {
    require(('../index'))({
      include: ['../include/base.yaml', '../include/theme.yaml']
    });

    expect(process.env.MAIN_THEME).toEqual('light');
    expect(process.env.BASE_ENV).toEqual('42');
  });

  test('NODE_ENV must rewrite general config', () => {
    require(('../index'))({
      configPath: '../config',
    });

    expect(process.env.GENERAL_A1).toEqual('40');
  });

  test('The plugin must return the configuration', () => {
    var conf = require(('../index'))({
      include: ['../include/base.yaml'],
      configPath: '../config/'
    });

    expect(conf.BASE_ENV).toEqual(42);
    expect(conf.DEVELOPMENT_ENV_VAR).toEqual(42);
  });
});

describe('Possible errors: ', () => {
  test('Should not throw an error if options.configPath is not defined', () => {
    require(('../index'))({});
  });

  test('Should not throw an error if options.include is not defined', () => {
    require(('../index'))({});
  });

  test('Should not throw an error if object of options is not defined', () => {
    require(('../index'))();
  });

  test('Should not throw an error if there is no config file for a specific NODE_ENV', () => {
    process.env.NODE_ENV = 'not-exists';

    require(('../index'))({
      configPath: '../config/',
    });
  });

  test('Should not throw an error if config file is empty', () => {
    process.env.NODE_ENV = 'development';

    require(('../index'))({
      include: ['../include/empty.yaml', '../include/base.yaml'],
      configPath: '../config/'
    });

    expect(process.env.DEVELOPMENT_ENV_VAR).toEqual('42');
    expect(process.env.BASE_ENV).toEqual('42');
  });

  test('Should throw an error if include file is not exists', () => {
    expect(() => {
      require(('../index'))({
        include: ['../include/not-exists.yaml']
      });
    }).toThrow();
  })
})
