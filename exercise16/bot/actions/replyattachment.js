module.exports = function(session, args, next) {
  var msg = new this.builder.Message(session)
    .ntext("I got %d attachment.", "I got %d attachments.", session.dialogData.view.dialog.attachment.length);
  session.dialogData.view.dialog.attachment.forEach(function (attachment) {
    msg.addAttachment(attachment);    
  });
  session.send(msg);
  next();
}