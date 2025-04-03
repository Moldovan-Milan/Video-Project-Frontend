// Polyfill a TextEncoder-nek
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;