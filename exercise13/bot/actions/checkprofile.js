module.exports = function(session, args, next) {
  console.log(this.getUserVariable(session, 'name'));
  if (this.getUserVariable(session, 'name')) {
    return next();
  }
  this.beginDialog('/profile', session, args, next);
}
