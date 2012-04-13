Voodoo.Obatala = (function(Voodoo, d, w) {
  var Obatala = Voodoo.Module.base(Voodoo.Events), _utils = Voodoo.utils;;
  Obatala.include({
    addAll: function(){
      var args = _utils.makeArray(arguments);
      for (var i=0; i < args.length; i++) this.add(args[i]);
    },
    add: function(controller) {
      this.subscribe('changeState', function(current) {
        if(controller == current)
          controller.activate();
        else
          controller.deactivate();
      });
      controller.active = this.proxy(function() {
        if (controller.pageLoad) controller.pageLoad();
        this.publish('changeState', controller);
      });
    }
  });
  Voodoo.Controller.include({
    active: function(callback){
      (typeof callback == "function") ? this.subscribe("active", callback) : this.publish("active");
      return this;
    },
    
    isActive: function(){
      return this.root.hasClass("active");
    },
    
    activate: function() {
      d.title = this.title || w.location;
      this.root.addClass("active");
      return this;
    },
    
    deactivate: function(){
      this.root.removeClass("active");
      return this;
    }
  });
  return Obatala;
})(Voodoo, document, window);