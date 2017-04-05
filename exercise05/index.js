/**
 * Begin dialog, End dialog, Repeat dialog
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
    next();
  },
  function(session, args, next) {
    session.beginDialog('/menu');
  },
  function(session, args, next) {
    session.endDialog('Goodbye!');
  }
]);

bot.dialog('/menu', [
    function(session, args, next) {
      builder.Prompts.choice(session, 'What do you want to do?', 
        ['Change name', 'Change age', 'Change language', 'Show data', 'Quit'])
    },
    function(session, args, next) {
      var entity = args.response.entity;
      if (entity === 'Quit') {
        return session.endDialog();
      }
      switch (entity) {
        case 'Change name': 
          session.beginDialog('/askname');
          break;
        case 'Change age':
          session.beginDialog('/askage');
          break;
        case 'Change language':
          session.beginDialog('/asklanguage');
          break;
        case 'Show data':
          session.beginDialog('/showdata');
          break;
        default:
          session.send('I don\'t understand');
      }
    },
    function(session, args, next) {
      session.replaceDialog('/menu');    
    }
]);

bot.dialog('/askname', [
  function (session, args, next) { 
	builder.Prompts.text(session, 'Hello! What\'s your name?');
  },
  function(session, args, next) {
    session.userData.name = args.response;
    session.endDialog();
  }
]);

bot.dialog('/askage', [
  function(session, args, next) {
    builder.Prompts.number(session, 'Hi '+session.userData.name+'. How old are you?');
  },
  function(session, args, next) {
    session.userData.age = args.response;
    session.endDialog();
  }
]);

bot.dialog('/asklanguage', [
  function(session, args, next) {
    builder.Prompts.choice(session, 'What language do you use to code Node?', 
        ['ES5', 'ES6', 'ES7', 'Typescript', 'CoffeScript']);
  }, 
  function(session, args, next) {
    session.userData.language = args.response.entity;
    session.endDialog();
  }
]);

bot.dialog('/showdata', [
  function(session, args, next) {
    session.send('Ok '+session.userData.name +
        '. You\'re '+session.userData.age+' years old and use ' +
        session.userData.language + ' to code.');
    session.endDialog();
  }
]);

bot.dialog('/profile', [
  function (session, args, next) { 
	session.beginDialog('/askname');
  },
  function(session, args, next) {
    session.beginDialog('/askage');
  },
  function(session, args, next) {
    session.beginDialog('/asklanguage');
  }, 
  function(session, args, next) {
    session.beginDialog('/showdata');
  },
  function(session, args, next) {
    session.endDialog();
  }
]);

