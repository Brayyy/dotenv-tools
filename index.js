var path = require('path');
var fs = require('fs');

var cfg = {
	// Debug casting
	debugCasting: false,
	// Default file name
	envFileName: '.env',
	// Default environment variable to look for to override default file name
	configKeyEnv: 'DOTENV_CONFIG',
	// Default command line argument to look for to override default file name
	configKeyArg: 'config',
	// Default command line argument to look for to override default file name
	passthroughChar: '*',
	// By default, exit if the .env file is not found
	requireFile: true,
	// By default, try casting strings to numbers
	castNumbers: true,
	// By default, try casting strings to booleans
	castBooleans: true,
	// By default, try casting JSON strings to objects. Failure to cast, value remains sting
	castJson: true,
};

function config (cfgIn) {
	cfgIn = cfgIn || {};
	Object.keys(cfgIn).forEach(function (key) {
		cfg[key] = cfgIn[key];
	});
}

function getPath () {
	// Default file name
	var envPath = cfg.envFileName;

	// See if the config path is defined by environment variable
	if (process.env[cfg.configKeyEnv]) {
		envPath = process.env[cfg.configKeyEnv];
	}

	// See if the config path is defined by command line argument
	process.argv.forEach(function (val) {
		if (val.indexOf('--' + cfg.configKeyArg + '=') === 0) {
			envPath = val.split('=')[1];
		}
	});

	// Add the local path as long as the file is not an absolute path starting with "/"
	if (envPath.substr(0, 1) !== '/') {
		var dirname = path.dirname(module.parent.filename);
		envPath = path.join(dirname, envPath);
	}

	// Exit the process if the .env file can not be found
	if (cfg.requireFile && !fs.existsSync(envPath)) {
		console.error('Could not open dotenv file at: ' + envPath);
		process.exit();
	}

	return envPath;
}

function getDotEnvConfig (dotenvCfgIn) {
	var dotenvCfg = dotenvCfgIn || {};
	dotenvCfg.path = getPath();
	return dotenvCfg;
}

function castVars () {
	// Clone process.env to env
	var env = JSON.parse(JSON.stringify(process.env));

	// Cast values as numbers or booleans if they look as such to make them easier to work with
	Object.keys(env).forEach(function (key) {
		if (env[key].substr(-1) === cfg.passthroughChar) {
			env[key] = env[key].substr(0, env[key].length - 1);
			if (cfg.debugCasting) {
				console.log(key, 'remains string, flagged for pass through');
			}
		} else if (cfg.castNumbers && !isNaN(env[key])) {
			env[key] *= 1;
			if (cfg.debugCasting) {
				console.log(key, 'was casted numeric');
			}
		} else if (cfg.castBooleans && env[key].toLowerCase() === 'true') {
			env[key] = true;
			if (cfg.debugCasting) {
				console.log(key, 'was casted boolean');
			}
		} else if (cfg.castBooleans && env[key].toLowerCase() === 'false') {
			if (cfg.debugCasting) {
				console.log(key, 'was casted boolean');
			}
			env[key] = false;
		} else if (cfg.castJson) {
			try {
				env[key] = JSON.parse(env[key]);
				if (cfg.debugCasting) {
					console.log(key, 'was casted object');
				}
			} catch (e) {
				if (cfg.debugCasting) {
					console.log(key, 'remains string, casting JSON string to object failed');
				}
			}
		} else if (cfg.debugCasting) {
			console.log(key, 'remains string, miss');
		}
	});

	return env;
}

module.exports = {
	config: config,
	getPath: getPath,
	getDotEnvConfig: getDotEnvConfig,
	castVars: castVars,
};
