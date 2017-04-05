/**
 * Go to another dialog with begin dialog.
 */
var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
  function(session, args, next) {
    if (!session.userData.name) {
      session.beginDialog('/profile');    
    } else {
      next();
    }
  },
  function(session, args, next) {
    session.send('Hello %s', session.userData.name);
  }
]);

bot.dialog('/profile', [
  function (session, args, next) { 
	builder.Prompts.text(session, 'Hello! What\'s your name?');
  },
  function(session, args, next) {
    session.userData.name = args.response;
    builder.Prompts.number(session, 'Hi '+session.userData.name+'. How old are you?');
  },
  function(session, args, next) {
    session.userData.age = args.response;
    builder.Prompts.choice(session, 'What language do you use to code Node?', 
        ['ES5', 'ES6', 'ES7', 'Typescript', 'CoffeScript']);
  }, 
  function(session, args, next) {
    session.userData.language = args.response.entity;
    session.send('Ok '+session.userData.name +
        '. You\'re '+session.userData.age+' years old and use ' +
        session.userData.language + ' to code.');
    next();
  }
]);
