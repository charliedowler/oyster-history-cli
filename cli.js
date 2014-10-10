#!/usr/bin/env node

var chalk = require('chalk');
var _ = require('underscore');
var prompt = require('prompt');
var argv = require('minimist')(process.argv.slice(2));
var TravelHistory = require('node-oyster-history');

function printResult(err, history) {
  if (err) throw new Error(err);

  if (history.length > 0) {
    // Print nice format
    history = _.groupBy(history, function(trip) { return trip.date.substr(0, trip.date.length - 6)});
    for (date in history) {
      console.log(chalk.cyan(date));
      for (trip in history[date]) {
        var route = history[date][trip];
        console.log(chalk.white(route.journey + ' => ') + (/\+/.test(route.charge) ? chalk.green(route.charge) : chalk.red('-' + route.charge)));
      }
      console.log('----------');
    }
  }
  else {
    console.log(chalk.red('\nNo oyster history available, if you\'ve travelled recently it may take 24 hours for it to become available.'));
  }
  process.exit(0);
}

if (argv.u && argv.p) {
  TravelHistory(argv.u, argv.p, printResult);
}
else {
  prompt.start();

  prompt.get({
    properties: {
      username: {
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
  }, function (err, result) {
    TravelHistory(result.username, result.password, printResult);
  });
}