Voodoo.Model = (function($, Voodoo) {
  var Model = Voodoo.Module.base();
  Model.extend(Voodoo.Events);
  Model.extend({
    created: function(sub) {
      this.records = {};
      this.attributes = [];
    },
    generateIds: false,
    find: function(id) {
      Voodoo.check.arg.isNotFalsy(id, 'Model.find');
      var entity = this.records[id];
      if(!entity) throw 'Entity not found with id ' + id;
      return entity.clone();
    },
    configure: function() {
      var attributes, name;
      name = arguments[0], attributes = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];
      this.className = name;
      this.records = {};
      this.attributes = attributes;
    },
    update: function(id, atts){
      this.find(id).updateAttributes(atts);
    },
    create: function(atts){
      var record = this.init(atts);
      record.save();
      return record;
    }
  });
  Model.include({
    newRecord: true,
    mopdel: true,
    validate: function() {},
    isValid: function() {},
    init: function(atts) {
      if (atts) this.load(atts);
    },
    load: function(atts){
      for(var name in atts)
        this[name] = atts[name];
    },
    attributes: function(){
      var result = {};
      for (var i=0; i < this.parent.attributes.length; i++) {
        var attr = this.parent.attributes[i];
        result[attr] = this[attr];
      }
      result.id = this.id;
      return result;
    },
    destroy: function() {
      this.publish("beforeDestroy", this);
      delete this.parent.records[this.id];
      this.publish("destroy", this);
    },
    eql: function(rec){
      return(rec && rec.id === this.id && 
             rec.parent === this.parent);
    },
    save: function() {
      var error = this.validate();
      if (error) {
        if ( !this.publish("error", this, error) )
          throw("Validation failed: " + error);
      }
      this.publish("beforeSave", this);
      this.newRecord ? this.create() : this.update();
      this.publish("save", this);
      return this;
    },
    updateAttribute: function(name, value){
      this[name] = value;
      return this.save();
    },
    updateAttributes: function(atts){
      this.load(atts);
      return this.save();
    },
    clone: function() {
      return Object.create(this);
    },
    dup: function(){
      var result = this.parent.init(this.attributes());
      result.newRecord = this.newRecord;
      return result;
    },
    create: function() {
      if(!this.id) this.id = Math.guid();
      this.newRecord = false;
      var records = this.parent.records;
      records[this.id] = this.dup();
      this.publish('create', records[this.id].clone());
    },
    update: function() {
      var records = this.parent.records;
      records[this.id] = this.clone();
      records[this.id].load(this.attributes());
      this.publish('update', records[this.id].clone());
    },
    subscribe: function(events, callback){
      return this.parent.subscribe(events, this.proxy(function(record){
        if ( record && this.eql(record) )
          callback.apply(this, arguments);
      }));
    },
    publish: function(){
      return this.parent.publish.apply(this.parent, arguments);
    }
  });
  return Model;
})(jQuery, Voodoo);