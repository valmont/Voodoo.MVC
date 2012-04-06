Voodoo.Controller = Voodoo.App = (function(Voodoo, $) {
  var Controller = Voodoo.Module.base(Voodoo.Events);
  Controller.include({
    eventSplitter: /^(\S+)\s*(.*)$/,
    initializer: function(options) {
      if(this.root) this.root = $(this.root);
      if(options) {
        this.root = this.root || (options.root) ? $(options.root) : $('body');
      }
      //set
      if ( !this.events ) this.events = this.parent.events;
          if ( !this.elements ) this.elements = this.parent.elements;

          //act
          if (this.events) this.delegateEvents();
          if (this.elements) this.bindElements();
          if (this.proxied) this.proxyAll.apply(this, this.proxied);
    },
    delegateEvents: function() {
      var key, methodName, method, match, eventName, selector;
      for(key in this.events) {
        methodName = this.events[key];
        method = this.proxy(this[methodName]);

        match = key.match(this.eventSplitter);
        eventName = match[1], 
        selector = match[2];
        if (selector === '') {
          this.root.bind(eventName, method);
        } else {
          this.root.delegate(selector, eventName, method);
        }
      }
    },
    bindElements: function() {
      var key;
      for(key in this.elements) {
        this[this.elements[key]] = $(key);
      }
    }
  });
  return Controller;
})(Voodoo, jQuery);