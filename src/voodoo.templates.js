Voodoo.templates = (function($, _utils) {
	var templates = {
		add: function(key, url) {
	      _utils.chkArg.isNotUndefinedOrEmpty(key, 'template key');
          if(url)
            setRemote(key);
          else
            setLocal(key);
		},
        get: function(key) {
            return (key) ? _templates[key] : _templates;
        },
        render: function(key, model) {
          _utils.chkArg.isNotUndefinedOrEmpty(key, 'template key');
          _utils.chkArg.isNotUndefined(model, 'template model');
          var template = $(this.get(key));
          template.byData('key').each(function() {
            var $this = $(this), modelKey = $this.data('key'), data = model[modelKey], t;
            $this.html((typeof data === 'function') ? data() : data);
          });
          return template;
        }
	}, _templates = {}, setLocal, setRemote, addTemplate;
    setLocal = function(key) {
      addTemplate(key, $('div').byData('voodoo-template', key).html());
    };
    setRemote = function(key, url) {
      $.get(url).then(function(template) {
        addTemplate(key, template);
      });
    };
    addTemplate = function(key, template) {
      _utils.chkArg.isNotUndefinedOrEmpty(template, 'template markup');
      _templates[key] = template;
    }

    return templates;
})(jQuery, Voodoo.utils);