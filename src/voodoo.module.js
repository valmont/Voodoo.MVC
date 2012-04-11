Voodoo.Module = Voodoo.App = (function(Voodoo, $) {
  var Module, _utils = Voodoo.utils, moduleKeywords = ["included", "extended"];;
  Module = {
    inherited: function() {},
    created: function() {},
    prototype: {
      init: function() {},
      initializer: function() {}
    },
    extend: function(obj){
      for(var key in obj)
        if (moduleKeywords.indexOf(key) == -1)
          this[key] = obj[key];
      var extended = obj.extended;
      if (extended) extended.apply(this);
      return this;
    },
    include: function(obj){
      for(var key in obj)
        if (moduleKeywords.indexOf(key) == -1)
          this.prototype[key] = obj[key];
      var included = obj.included;
      if (included) included.apply(this);
      return this;
    },
    proxy: function(func) {
      _utils.chkAarg.isNotUndefined(func);
      var localScope = this;
      return (function() {
        var args = _utils.makeArray(arguments);
        if(args.length > 0 && args[0].target !== 'undefined') args.push($(args[0].target));
        func.apply(localScope, args);
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