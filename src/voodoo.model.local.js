Voodoo.Model.Local = (function(Voodoo) {
  var Local = {
    extended: function(){
      this.sync(this.proxy(this.saveLocal));
      this.fetch(this.proxy(this.loadLocal));
    },
    saveLocal: function() {
      var result = [];
      for(var i in this.records) {
        result.push(this.records[i]);
      }
      localStorage[this.className] = JSON.stringify(result);
    },
    loadLocal: function() {
      var result = localStorage.getItem(this.className);
      if(result)
        this.populate(JSON.parse(result));
    }
  };
  return Local;
})(Voodoo);