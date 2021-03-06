/*
 * Copyright (c) 2017 Bonnie Schulkin. All Rights Reserved.
 *
 * This file is part of BoxCharter.
 *
 * BoxCharter is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * BoxCharter is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with BoxCharter. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* adapted from https://gist.github.com/vikas5914/cf568748ac89446e19ecd5e2e6900443 */

const winston = require('winston');

// set default log level.
const logLevel = process.env.NODE_ENV === 'dev' ? 'debug' : 'warn';

// these constants exportable for use in other logging files
const logRoot = '/var/log/boxcharter/';
const errorLogTransport = new winston.transports.File({
  filename: `${logRoot}/error_log`,
  colorize: false,
  timestamp: true,
  json: false,
  maxsize: '1024',
  maxFiles: 10,
  tailable: true,
  zippedArchive: true,
});

// Set up logger
const customColors = {
  trace: 'white',
  debug: 'green',
  info: 'blue',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red',
};

const transports = [errorLogTransport];

// only log to the console in dev mode
if (process.env.NODE_ENV === 'dev') {
  transports.push(new (winston.transports.Console)({
    colorize: true,
    timestamp: true,
  }));
}

const logger = new (winston.Logger)({
  colors: customColors,
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  transports,
});

winston.addColors(customColors);

/* LOGGER EXAMPLES
  var log = require('./log.js')
  log.trace('testing')
  log.debug('testing')
  log.info('testing')
  log.warn('testing')
  log.crit('testing')
  log.fatal('testing')
 */

/**
  * Log an Error
  * @param  {string} msg context of error
  * @param  {Error} e   Error to be logged
  * @return {Error}     Error with revised message
  */
const logError = function (msg, e) {
  logger.crit(msg);
  logger.log('crit', e.stack);
  return new Error(`${msg}: ${e.toString()}`);
};


module.exports = {
  logger,
  logError,
  logRoot,
  errorLogTransport,
};
