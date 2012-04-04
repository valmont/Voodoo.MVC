@echo off
set PATH=\
ajaxmin -clobber src\voodoo.core.js src\voodoo.utils.js src\voodoo.events.js src\voodoo.module.js src\voodoo.controller.js src\voodoo.model.js src\voodoo.routes.js src\voodoo.bossman.js -o lib\voodoo.min.js
echo ----------------------------------------------