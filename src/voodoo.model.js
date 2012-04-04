Voodoo.Model = (function($, Voodoo) {
	var Model = Voodoo.Module.create();
	Model.extend({
		records: {},
		generateIds: false,
		find: function(id) {
			Voodoo.check.arg.isNotFalsy(id);
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
	    }
	});
	Model.include({
		newRecord: true,
		validate: function() {},
		isValid: function() {},
		init: function(atts) {
			if (!atts) return;
			for(var name in atts) {
				this[name] = atts[name];
			}
		},
		create: function() {
			if(!this.id) this.id = Math.guid();
			this.newRecord = false;
			this.parent.records[this.id] = this;
		},
		update: function() {
			this.parent.records[this.id] = this.clone();
		},
		destroy: function() {
			delete this.parent.records[this.id];
		},
		save: function() {
			this.newRecord ? this.create() : this.update();
		},
		clone: function() {
			return $.extend(true, {}, this);
		}
	});
	return Model;
})(jQuery, Voodoo);