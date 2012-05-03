Voodoo.Controller = (function(Voodoo, $) {
  var Controller = Voodoo.Module.base(Voodoo.Events);
  Controller.include({
    eventSplitter: /^(\S+)\s*(.*)$/,
    initializer: function(options) {
      var that = this;
      if(this.root) this.root = $(this.root);
      if(options) {
        this.root = this.root || ((options.root) ? $(options.root) : $('body'));
        for (var key in options) {
          this[key] = options[key];
        }
      }
      if ( !this.events ) this.events = this.parent.events;
      if ( !this.elements ) this.elements = this.parent.elements;

      if (this.events) this.delegateEvents();
      if (this.elements) this.bindElements();
      if (this.proxied) this.proxyAll.apply(this, this.proxied);
    },
    initialized: function() {
      window.VoodooManager.add(this);
    },
    delegateEvents: function() {
      var key, methodName, match, eventName, selector;
      for(key in this.events) {
        methodName = this.events[key];
        match = key.match(this.eventSplitter);
        eventName = match[1], 
        selector  = match[2];
        if (selector === '') {
          this.root.bind(eventName, this.proxy(this[methodName]));
        } else {
          this.root.delegate(selector, eventName, method = this.proxy(this[methodName], $(selector)));
        }
      }
    },
    bindElements: function() {
      var key;
      for(key in this.elements) {
        this[this.elements[key]] = $(this.root + ' ' + key);
      }
    }
  });
  Voodoo.App = Controller.base();
  Voodoo.App.include({initialized: function() {
    this.manager = window.VoodooManager = Voodoo.Obatala.init();
  }});
  return Controller;
})(Voodoo, jQuery);