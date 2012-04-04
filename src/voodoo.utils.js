Voodoo.utils = (function() {
	var utils = {
		chkAarg: {}
	},
	_undefined;
	utils.chkAarg.isNotFalsy = function(obj) {
		if(!obj)
			throw 'Argument cannot be falsy';
	};

	utils.chkAarg.isNotUndefined = function(obj) {
		if(obj === _undefined)
			throw 'Argument cannot be undefined';
	};

	utils.chkAarg.isNotEmpty = function(obj) {
		if(obj === '')
			throw 'Argument cannot be empty';
	};

	utils.chkAarg.isFunction = function(obj) {
		if(typeof obj !== 'function')
			throw 'Argument must be a function';
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