Voodoo.utils = (function() {
  var utils = {
    chkArg: {}
  },
  _undefined,
  throwError;
  throwError = function(msg) {
    throw msg;
  }
  utils.chkArg.isNotFalsy = function(obj, msg) {
    if(!obj)
      throwError((msg) ? 'Argument cannot be falsy : ' + msg : 'Argument cannot be falsy');
  };

  utils.chkArg.isNotUndefined = function(obj, msg) {
    if(obj === _undefined)
      throwError((msg) ? 'Argument cannot be undefined : ' + msg : 'Argument cannot be undefined');
  };

  utils.chkArg.isNotEmpty = function(obj, msg) {
    if(obj === '')
      throwError((msg) ? 'Argument cannot be empty : ' + msg : 'Argument cannot be empty');
  };

  utils.chkArg.isNotUndefinedOrEmpty = function(obj, msg) {
    this.isNotUndefined(obj,msg);
    this.isNotEmpty(obj, msg);
  };

  utils.chkArg.isFunction = function(obj, msg) {
    if(typeof obj !== 'function')
      throwError((msg) ? 'Argument must be a function : ' + msg : 'Argument must be a function');
  };

  utils.makeArray = function(args){
    return Array.prototype.slice.call(args, 0);
  };

  utils.each = function(collection, func) {
    this.chkArg.isNotUndefined(collection);
    this.chkArg.isNotUndefined(func);
    this.chkArg.isFunction(func);
    var i = 0, l = collection.length;
    for(i; i < l; i++) {
      if(func(collection[i], i) === false) break;
    }
  };

  return utils;
})(Voodoo);