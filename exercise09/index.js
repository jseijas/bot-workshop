var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var model = process.env.BOT_LUIS_MODEL;
console.log(model);
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

intents.matches('builtin.intent.places.find_place', [
  function (session, args, next) {
    var place = builder.EntityRecognizer.findEntity(args.entities, 'builtin.places.place_type');
    var cuisine = builder.EntityRecognizer.findEntity(args.entities, 'builtin.places.cuisine');
    var time = builder.EntityRecognizer.resolveTime(args.entities);

    if (place.resolution.value == "restaurants") {
      if (!cuisine) {
        session.send('You\'re lookin for a restaurant. Some preference?');
      }
      else {
        session.send('OK. You\'re looking for a %s retaurant. Here we go!', cuisine.entity);
        if (time) {
          session.send('You want the reservation for the date: %d/%d/%d', time.getMonth() + 1, time.getDate(), time.getFullYear());
        }
      }
    }
    else {
      session.send('Sorry, we only allow restaurants right now');
    }
    session.endDialog();
  }
]);

intents.onDefault(builder.DialogAction.send('I\'m sorry, I can\'t understand'));


bot.dialog('/', [
  function (session, results, next) {
    session.send('Hello!');
    session.send('How can I help you?');
    session.beginDialog('/natural');
  }
]);

bot.dialog('/natural', intents);
