Voodoo.utils = (function() {
	var utils = {
		chkAarg: {}
	},
	_undefined,
	throwError;
	throwError = function(msg) {
		throw msg;
	}
	utils.chkAarg.isNotFalsy = function(obj, msg) {
		if(!obj)
			throwError((msg) ? 'Argument cannot be falsy : ' + msg : 'Argument cannot be falsy');
	};

	utils.chkAarg.isNotUndefined = function(obj, msg) {
		if(obj === _undefined)
			throwError((msg) ? 'Argument cannot be undefined : ' + msg : 'Argument cannot be undefined');
	};

	utils.chkAarg.isNotEmpty = function(obj, msg) {
		if(obj === '')
			throwError((msg) ? 'Argument cannot be empty : ' + msg : 'Argument cannot be empty');
	};

	utils.chkAarg.isFunction = function(obj, msg) {
		if(typeof obj !== 'function')
			throwError((msg) ? 'Argument must be a function : ' + msg : 'Argument must be a function');
	};

	utils.makeArray = function(args){
		return Array.prototype.slice.call(args, 0);
	};

	utils.each = function(collection, func) {
		this.chkAarg.isNotUndefined(collection);
		this.chkAarg.isNotUndefined(func);
		this.chkAarg.isFunction(func);
		var i = 0, l = collection.length;
		for(i; i < l; i++) {
			if(func(collection[i], i) === false) break;
		}
	};

	return utils;
})(Voodoo);