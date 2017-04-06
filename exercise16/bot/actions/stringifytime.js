module.exports = function(session, args, next) {
  session.dialogData.view.dialog.timestr = JSON.stringify(session.dialogData.view.dialog.time);
  next();
}