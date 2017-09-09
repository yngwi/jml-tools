/* eslint-disable */
// adapted based on survivejs/react-component-boilerplate (MIT)
// Node 0.10+
var execSync = require('child_process').execSync;
var stat = require('fs').stat;

// Node 0.10 check
if (!execSync) {
    execSync = require('sync-exec');
}

function exec(command) {
    execSync(command, {
        stdio: [0, 1, 2],
    });
}

stat('dist-modules', function (error, stat) {
    // Skip building on Travis
    if (process.env.TRAVIS) {
        return;
    }

    if (error || !stat.isDirectory()) {
        exec('npm i babel-cli babel-preset-env babel-plugin-transform-object-rest-spread');
        exec('npm run dist:modules');
    }
});