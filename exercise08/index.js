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

bot.dialog('/', [
  function (session, args, next) {
    var card = new builder.HeroCard(session)
      .title('Demo of the Microsoft Bot Framework')
      .text("What can do your bots?")
      .images([
        builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
      ]);
    var msg = new builder.Message(session).attachments([card]);
    session.send(msg);
    session.send("Hi. I'm a demo of the UI elements of a bot");
    next();
  },
  function (session, results) {
    session.beginDialog('/menu');
  },
  function (session, results) {
    session.send("Ok... See you later!");
  }
]);

bot.dialog('/menu', [
  function (session) {
    builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|(quit)");
  },
  function (session, results) {
    if (results.response && results.response.entity != '(quit)') {
      session.beginDialog('/' + results.response.entity);
    } else {
      session.endDialog();
    }
  },
  function (session, results) {
    session.replaceDialog('/menu');
  }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/prompts', [
  function (session) {
    session.send("Our Bot Builder SDK has a rich set of built-in prompts that simplify asking the user a series of questions. This demo will walk you through using each prompt. Just follow the prompts and you can quit at any time by saying 'cancel'.");
    builder.Prompts.text(session, "Prompts.text()\n\nEnter some text and I'll say it back.");
  },
  function (session, results) {
    session.send("You entered '%s'", results.response);
    builder.Prompts.number(session, "Prompts.number()\n\nNow enter a number.");
  },
  function (session, results) {
    session.send("You entered '%s'", results.response);
    session.send("Bot Builder includes a rich choice() prompt that lets you offer a user a list choices to pick from. On Facebook these choices by default surface using Quick Replies if there are 10 or less choices. If there are more than 10 choices a numbered list will be used but you can specify the exact type of list to show using the ListStyle property.");
    builder.Prompts.choice(session, "Prompts.choice()\n\nChoose a list style (the default is auto.)", "auto|inline|list|button|none");
  },
  function (session, results) {
    var style = builder.ListStyle[results.response.entity];
    builder.Prompts.choice(session, "Prompts.choice()\n\nNow pick an option.", "option A|option B|option C", { listStyle: style });
  },
  function (session, results) {
    session.send("You chose '%s'", results.response.entity);
    builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
  },
  function (session, results) {
    session.send("You chose '%s'", results.response ? 'yes' : 'no');
    builder.Prompts.time(session, "Prompts.time()\n\nThe framework can recognize a range of times expressed as natural language. Enter a time like 'Monday at 7am' and I'll show you the JSON we return.");
  },
  function (session, results) {
    session.send("Recognized Entity: %s", JSON.stringify(results.response));
    builder.Prompts.attachment(session, "Prompts.attachment()\n\nYour bot can wait on the user to upload an image or video. Send me an image and I'll send it back to you.");
  },
  function (session, results) {
    var msg = new builder.Message(session)
      .ntext("I got %d attachment.", "I got %d attachments.", results.response.length);
    results.response.forEach(function (attachment) {
      msg.addAttachment(attachment);
    });
    session.endDialog(msg);
  }
]);

bot.dialog('/picture', [
  function (session) {
    session.send("You can easily send pictures to a user...");
    var msg = new builder.Message(session)
      .attachments([{
        contentType: "image/jpeg",
        contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
      }]);
    session.endDialog(msg);
  }
]);

bot.dialog('/cards', [
  function (session) {
    session.send("You can use either a Hero or a Thumbnail card to send the user visually rich information. On Facebook both will be rendered using the same Generic Template...");

    var msg = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
          .title("Hero Card")
          .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
          ])
          .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
      ]);
    session.send(msg);

    msg = new builder.Message(session)
      .attachments([
        new builder.ThumbnailCard(session)
          .title("Thumbnail Card")
          .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
          ])
          .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
      ]);
    session.endDialog(msg);
  }
]);

bot.dialog('/list', [
  function (session) {
    session.send("You can send the user a list of cards as multiple attachments in a single message...");

    var msg = new builder.Message(session)
      .attachments([
        new builder.HeroCard(session)
          .title("Space Needle")
          .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
          ]),
        new builder.HeroCard(session)
          .title("Pikes Place Market")
          .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
          ])
      ]);
    session.endDialog(msg);
  }
]);

bot.dialog('/carousel', [
  function (session) {
    session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");

    // Ask the user to select an item from a carousel.
    var msg = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments([
        new builder.HeroCard(session)
          .title("Space Needle")
          .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
              .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
          ])
          .buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
          ]),
        new builder.HeroCard(session)
          .title("Pikes Place Market")
          .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
              .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
          ])
          .buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
            builder.CardAction.imBack(session, "select:101", "Select")
          ]),
        new builder.HeroCard(session)
          .title("EMP Museum")
          .subtitle("EMP Musem is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
          .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
              .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
          ])
          .buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
            builder.CardAction.imBack(session, "select:102", "Select")
          ])
      ]);
    builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
  },
  function (session, results) {
    var action, item;
    var kvPair = results.response.entity.split(':');
    switch (kvPair[0]) {
      case 'select':
        action = 'selected';
        break;
    }
    switch (kvPair[1]) {
      case '100':
        item = "the Space Needle";
        break;
      case '101':
        item = "Pikes Place Market";
        break;
      case '102':
        item = "the EMP Museum";
        break;
    }
    session.endDialog('You %s "%s"', action, item);
  }
]);

bot.dialog('/receipt', [
  function (session) {
    session.send("You can send a receipts for facebook using Bot Builders ReceiptCard...");
    var msg = new builder.Message(session)
      .attachments([
        new builder.ReceiptCard(session)
          .title("Recipient's Name")
          .items([
            builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
            builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
          ])
          .facts([
            builder.Fact.create(session, "1234567898", "Order Number"),
            builder.Fact.create(session, "VISA 4076", "Payment Method")
          ])
          .tax("$4.40")
          .total("$48.40")
      ]);
    session.endDialog(msg);
  }
]);

