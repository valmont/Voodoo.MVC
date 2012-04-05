Voodoo.Module = Voodoo.App = (function(Voodoo, $) {
	var Module, _utils = Voodoo.utils;
	Module = {
		inherited: function() {},
		created: function() {},
		prototype: {
			init: function() {},
			initializer: function() {}
		},
		extend: function(obj) {
			_utils.chkAarg.isNotUndefined(obj, 'Module.extend');
			var extended = obj.extended;
			$.extend(this, obj);
			if (extended) extended(this);
			return this;
		},
		include: function(obj) {
			_utils.chkAarg.isNotUndefined(obj, Module.include);
			var included = obj.included;
			$.extend(this.prototype, obj);
			if (included) included(this);
			return this;
		},
		proxy: function(func) {
			_utils.chkAarg.isNotUndefined(func, 'Module.proxy');
			var localScope = this;
			return (function() {
				func.apply(localScope, arguments);
			});
		},
		proxyAll: function(){
	      var functions = _utils.makeArray(arguments);
	      for (var i=0; i < functions.length; i++)
	        this[functions[i]] = this.proxy(this[functions[i]]);
	    },
		create: function(include, extend) {
			var obj = Object.create(this);
			obj.parent = this;
			obj.prototype = obj.fn = Object.create(this.prototype);
			if (include) obj.include(include);
      		if (extend)  obj.extend(extend);
			obj.created();
			this.inherited(obj);
			return obj;
		},
		init: function() {
			var initance = Object.create(this.prototype);
			initance.parent = this;
			initance.initializer.apply(initance, arguments);
      		initance.init.apply(initance, arguments);
			return initance;
		}
	};
	Module.prototype.proxy = Module.proxy;
	Module.prototype.proxyAll = Module.proxyAll;
	Module.base = Module.create;
	return Module;
})(Voodoo, jQuery);