// Create an Alt singleton for the FLUX pattern
// Note that Javascript modules are singletons
var Alt = require('alt');
var alt = new Alt();

var chromeDebug = require('alt/utils/chromeDebug')
chromeDebug(alt);

module.exports = alt;
