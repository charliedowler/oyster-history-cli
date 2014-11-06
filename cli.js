#!/usr/bin/env node

var chalk = require('chalk');
var _ = require('underscore');
var prompt = require('prompt');
var argv = require('minimist')(process.argv.slice(2));
var TravelHistory = require('oyster-history');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner();
spinner.setSpinnerString('|/-\\');

function printResult(err, history) {
  if (err) throw new Error(err);
  spinner.stop();

  if (history.length > 0) {
    // Print nice format
    history = _.groupBy(history, function(trip) { return trip.date.substr(0, trip.date.length - 6)});
    for (date in history) {
      console.log(chalk.cyan(date));
      var trips = history[date].reverse();
      for (trip in trips) {
        var route = trips[trip];
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
  spinner.start();
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
    spinner.start();
    TravelHistory(result.username, result.password, printResult);
  });
}
