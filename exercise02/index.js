/**
 * Waterfall
 */
var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
  function (session, args, next) { 
	session.send('Hello World');
    next(); 
  },
  function(session, args, next) {
    session.send('This is another message in the pipeline');
    next();
  }
]);

