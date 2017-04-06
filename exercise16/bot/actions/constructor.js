module.exports = function(next) {
  this.getDialog('/menu').reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });
  next();
};
