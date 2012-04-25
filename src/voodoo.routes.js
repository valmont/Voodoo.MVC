Voodoo.Route = (function(Voodoo, $){  
  var Route = Voodoo.Module.base();
  
  var hashStrip = /^#*/;
  
  Route.extend({
    routes: [],
    
    historySupport: ("history" in window),
    history: false,
        
    add: function(path, callback){
      if (typeof path == "object")
        for(var p in path) this.add(p, path[p]);
      else
        this.routes.push(this.init(path, callback));
    },
    
    setup: function(options){
      if (options && options.history)
        this.history = this.historySupport && options.history;
        
      if ( this.history )
        $(window).bind("popstate", this.change);
      else
        $(window).bind("hashchange", this.change);
        
      this.change();
    },
    
    unbind: function(){
      if (this.history)
        $(window).unbind("popstate", this.change);
      else
        $(window).unbind("hashchange", this.change);
    },
    
    navigate: function(){
      var args = Voodoo.utils.makeArray(arguments);
      var triggerRoutes = false;
      
      if (typeof args[args.length - 1] == "boolean") {
        triggerRoutes = args.pop();
      }
      var path = args.join("/");      
      if (this.path == path) return;
      
      if ( !triggerRoutes )
        this.path = path;
      if (this.history)
        history.pushState({}, 
          document.title, 
          this.getHost() + path
        );
      else
        window.location.hash = path;
    },
    
    // Private
    
    getPath: function(){
      return window.location.pathname;
    },
    
    getHash: function(){
      return window.location.hash;
    },
    
    getHost: function(){
      return((document.location + "").replace(
        this.getPath() + this.getHash(), ""
      ));
    },
    
    getFragment: function(){
      return this.getHash().replace(hashStrip, "");
    },
    
    change: function(e) {
      console.log(e);
      var path = (this.history ? this.getPath() : this.getFragment());
      if (path == this.path) return;
      this.path = path;
      for (var i=0; i < this.routes.length; i++)
        if (this.routes[i].match(path)) return;
    }
  });
  
  Route.proxyAll("change");
  
  var namedParam   = /:([\w\d]+)/g;
  var splatParam   = /\*([\w\d]+)/g;
  var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

  Route.include({    
    init: function(path, callback){
      this.callback = callback;
      if (typeof path == "string") {      
        path = path.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
                       
        this.route = new RegExp('^' + path + '$');
      } else {
        this.route = path;
      }
    },
    
    match: function(path){
      var match = this.route.exec(path)
      if ( !match ) return false;
      var params = match.slice(1);
      this.callback.apply(this.callback, params);
      return true;
    }
  });
  
  Voodoo.Controller.fn.route = Voodoo.App.fn.route = function(path, callback){
    Voodoo.Route.add(path, this.proxy(callback));
  };
  
  Voodoo.Controller.fn.routes = Voodoo.App.fn.routes = function(routes){
    for(var path in routes)
      this.route(path, routes[path]);
      return this;
  };
  
  Voodoo.Controller.fn.navigate = Voodoo.App.fn.navigate = function() {
    Voodoo.Route.navigate.apply(Voodoo.Route, arguments);
  };

  Voodoo.Controller.fn.setupRoutes = Voodoo.App.fn.setupRoutes = function() {
    Voodoo.Route.setup.apply(Voodoo.Route, arguments);
  };

  return Route;
})(Voodoo, jQuery);