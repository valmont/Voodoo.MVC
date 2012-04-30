(function(exports, Object, Array, Math) {
  var Voodoo = {
    version: '0.5.0',
    init: function() {
      addShims();
    }
  },
  addShims;

  addShims = function() {
    if(typeof Object.create !== 'function') {
      Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
      };
    }
    if(typeof Math.guid !== 'function') {
      Math.guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        }).toUpperCase();
      };
    }
    if (typeof Array.prototype.indexOf === "undefined")
        Array.prototype.indexOf = function(value){
          for ( var i = 0; i < this.length; i++ )
            if ( this[ i ] === value )
              return i;
          return -1;
      };
  };
  $.fn.byData = function( type, value ) {
    return this.filter( function() {
        var $this = $( this );

        return value != null ?
            $this.data( type ) === value :
            $this.data( type ) != null;
    });
  };
  if(!exports.Voodoo) {
    exports.Voodoo = Voodoo;
  }
  Voodoo.init();
})(window, Object, Array, Math);