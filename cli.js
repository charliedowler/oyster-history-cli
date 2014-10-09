#!/usr/bin/env node

var chalk = require('chalk');
var prompt = require('prompt');
var argv = require('minimist')(process.argv.slice(2));
var TravelHistory = require('node-oyster-history');

function printResult(err, history) {
  if (err) throw new Error(err);

  if (history.length > 0) {
    // Print nice format
    history.forEach(function(trip) {
      console.log(trip.journey + ' => ' + trip.charge);
    });
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