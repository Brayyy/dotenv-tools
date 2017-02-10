# dotenv-tools
---
Dotenv-tools is a zero-dependency plugin for [dotenv](https://github.com/motdotla/dotenv), adding some small, commonly needed tools. There are other [dotenv](https://github.com/motdotla/dotenv) plugins which achieve some of the tasks here, but I felt there was too much going on to achieve a very simple goal; load the environment variables they way I'd expect them to load.

Node's `process.env` can only store strings, so if using the `castVars()` function, store the result to a local and/or global variable, and reference it instead of `process.env` directly. In the example below, I use `GLOBAL.env` and `env` for full coverage.

### Features include:
- Specify a file other than `.env` to load using an environment variable or command line argument.
- Change the default `.env` file that dotenv loads.
- Run projects outside of the project path, and still have dotenv pick up the `.env` file local to the project source.
- Returns an object with the newly casted environment variables for you to write to local or global variable.
- Read the values of the `.env` file, and automatically cast them as boolean, numeric, or objects.
- Option to disable casting of specific primitive types.
- Option to skip casting by ending string with a special character. By default, `*`.
- Only use the tools you want.

Examples of running from command line using alternate dotenv file:
```bash
# Single execution defining dotenv file via command line argument
node myapp.js --config=.env_alternate

# Single execution defining dotenv file via environment variable:
DOTENV_CONFIG=.env_alternate node myapp.js

# Define dotenv file once via environment variable, and have it persist for the duration of your session:
export DOTENV_CONFIG=.env_alternate
node myapp.js
```

Example .env with castable variables:
```dosini
WILL_BE_NUMERIC_A=123
WILL_BE_NUMERIC_B=123.456
WILL_BE_STRING_A=abc
WILL_BE_STRING_B='def'
WILL_BE_STRING_C="ghi"
WILL_BE_STRING_D=true*
WILL_BE_STRING_E=1234*
WILL_BE_STRING_F=["a","b","c"]*
WILL_BE_STRING_G={"j": 1, "k": 2, "l": 3}*
WILL_BE_STRING_H='{"debug":"on","window":{"title":"Sample Widget","name":"main_window","dimentions":[500,500]}}*'
WILL_BE_BOOLEAN_A=true
WILL_BE_BOOLEAN_B=false
WILL_BE_BOOLEAN_C='true'
WILL_BE_BOOLEAN_D='false'
WILL_BE_OBJECT_A=[5,6,7]
WILL_BE_OBJECT_B=["a","b","c"]
WILL_BE_OBJECT_C='["d","e","f"]'
WILL_BE_OBJECT_D='[ "g" , "h" , "i" ]'
WILL_BE_OBJECT_E={"j": 1, "k": 2, "l": 3}
WILL_BE_OBJECT_F={"debug":"on","window":{"title":"Sample Widget","name":"main_window","dimentions":[500,500]}}
WILL_BE_OBJECT_G='{"debug":"on","window":{"title":"Sample Widget","name":"main_window","dimentions":[500,500]}}'
```

Example usage, using default setup:
```javascript
// Require dotenv-tools
var dotEnvTools = require('dotenv-tools');

// Create dotenv config object using default dotenv-tools settings
var dotenvCfg = dotEnvTools.getDotEnvConfig();

// Start dotenv with created config object
require('dotenv').config(dotenvCfg);

// Cast process.env variables to likely natives, and save result as both local var env and global.env
var env = GLOBAL.env = dotEnvTools.castVars();
```

Example usage, using custom setup:
```javascript
// Require dotenv-tools
var dotEnvTools = require('dotenv-tools');

// Configure dotenv-tools
dotEnvTools.config(
  envFileName: '.env_file',
  configKeyArg: 'configfile',
  castJson: false
);

// Create dotenv config object passing in addional config for returning dotenv object
var dotenvCfg = dotEnvTools.getDotEnvConfig({
  encoding: 'base64'
});

// Start dotenv with created config object
require('dotenv').config(dotenvCfg);

// Cast process.env variables to likely natives, and save result as both local var env and global.env
var env = GLOBAL.env = dotEnvTools.castVars();
```

Config options, and their defaults:
```javascript
// Debug casting
debugCasting: false

// Default file name
envFileName: '.env'

// Environment variable to look for to override default file name
configKeyEnv: 'DOTENV_CONFIG'

// Command line argument to look for to override default file name
configKeyArg: 'config'

// Character to look for, signaling to skip cast attempt
passthroughChar: '*'

// Exit if the .env file is not found
requireFile: true

// Try casting strings to numbers
castNumbers: true

// Try casting strings to booleans
castBooleans: true

// Try casting JSON strings to objects. Failure to cast, value remains sting
castJson: true
```
