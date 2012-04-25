Voodoo.Model.Local = (function(Voodoo) {
  var Local = {
    canStore: (function(){
      console.log('test');
      try {
        localStorage.setItem("mod", "mod");
        localStorage.removeItem("mod");
        return true;
      }
      catch(e) {
        return false;
      }
    })(),
    extended: function() {
      this.sync(this.proxy(this.saveLocal));
      this.fetch(this.proxy(this.loadLocal));
    },
    saveLocal: function() {
      if(!this.canStore) return;
      var result = [];
      for(var i in this.records) {
        result.push(this.records[i]);
      }
      localStorage[this.className] = JSON.stringify(result);
    },
    loadLocal: function() {
      if(!this.canStore) return;
      var result = localStorage.getItem(this.className);
      if(result)
        this.populate(JSON.parse(result));
    }
  };
  return Local;
})(Voodoo);