var async = require('async');

module.exports = function(session, args, next) {
  async.parallel([
    this.setUserVariable.bind(this, session, 'name', null),  
    this.setUserVariable.bind(this, session, 'age', null),  
    this.setUserVariable.bind(this, session, 'language', null),  
  ], function(err, results) {
    session.endDialog('Profile reseted');
  });
}