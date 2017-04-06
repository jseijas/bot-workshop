module.exports = function(next) {
  this.bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
  this.bot.beginDialogAction('help', '/help', { matches: /^help/i });
  this.bot.beginDialogAction('reset', '/reset', { matches: /^reset/i });
  this.bot.beginDialogAction('menu', '/menu', { matches: /^menu/i });
  next();
};
