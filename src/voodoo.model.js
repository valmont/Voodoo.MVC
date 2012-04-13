Voodoo.Model = (function($, Voodoo) {
  var Model = Voodoo.Module.base(), _utils = Voodoo.utils;
  Model.extend(Voodoo.Events);
  Model.extend({
    created: function(sub) {
      this.records = {};
      this.attributes = [];
      this.subscribe("create",  this.proxy(function(record){ 
        this.publish("change", "create", record);
      }));
      this.subscribe("update",  this.proxy(function(record){ 
        this.publish("change", "update", record);
      }));
      this.subscribe("destroy", this.proxy(function(record){ 
        this.publish("change", "destroy", record);
      }));
    },
    generateIds: false,
    find: function(id) {
      Voodoo.check.arg.isNotFalsy(id, 'Model.find');
      var entity = this.records[id];
      if(!entity) throw 'Entity not found with id ' + id;
      return entity.clone();
    },
    first: function(){
      var record = this.recordsValues()[0];
      return(record && record.clone());
    },
    last: function(){
      var values = this.recordsValues()
      var record = values[values.length - 1];
      return(record && record.clone());
    },
    all: function(){
      return this.cloneArray(this.recordsValues());
    },
    sync: function(callback){
      this.subscribe("change", callback);
    },
    fetch: function(callback){
      callback ? this.subscribe("fetch", callback) : this.publish("fetch");
    },
    populate: function(items) {
      //clear existing items
      this.records = {};
      var that = this, r;
      _utils.each(items, function(item, i) {
        r = that.init(item);
        r.newRecord = false;
        that.records[r.id] = r;
      });

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
    },
    recordsValues: function(){
      var result = [];
      for (var key in this.records)
        result.push(this.records[key]);
      return result;
    },
    cloneArray: function(array){
      var result = [];
      for (var i=0; i < array.length; i++)
        result.push(array[i].dup());
      return result;
    }
  });
  Model.include({
    newRecord: true,
    model: true,
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
    toJSON: function() {
      return (this.attributes());
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
    },
    post: function(url, callback) {
      Voodoo.utils.chkAarg.isNotUndefined(url, 'Model.post');
      this.ajax(url, callback, 'post');
    },
    get: function(url, callback) {
      Voodoo.utils.chkAarg.isNotUndefined(url, 'Model.post');
      this.ajax(url, callback, 'get');
    },
    ajax: function(url, callback, method) {
      var func = callback ? this.proxy(callback) : callback, model = JSON.stringify(this.attributes());
      $.ajax({
        url: url,
        type: method,
        data: model,
        dataType: 'JSON',
        contentType: 'application/json charset=utf-8',
        success: func,
        error: func
      });
    }
  });
  return Model;
})(jQuery, Voodoo);