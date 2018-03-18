/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var ConcatSource = require("webpack-sources").ConcatSource;
var Template = require("webpack/lib/Template");

function JsonpChunkTemplatePlugin() { }
module.exports = JsonpChunkTemplatePlugin;

JsonpChunkTemplatePlugin.prototype.apply = function (chunkTemplate) {

	//JSONP version
	chunkTemplate.hooks.render.tap("JsonpChunkTemplatePlugin", (modules, chunk) => {
		var jsonpFunction = chunkTemplate.outputOptions.jsonpFunction;
		var source = new ConcatSource();
		source.add(jsonpFunction + "(" + JSON.stringify(chunk.ids) + ",");
		source.add(modules);
		var entries = [chunk.entryModule].filter(Boolean).map(function (m) {
			return m.id;
		});
		if (entries.length > 0) {
			source.add("," + JSON.stringify(entries));
		}
		source.add(")");
		return source;
	});
	chunkTemplate.hooks.hash.tap("JsonpChunkTemplatePlugin", hash => {
		hash.update("JsonpChunkTemplatePlugin");
		hash.update("3");
		hash.update(chunkTemplate.outputOptions.jsonpFunction + "");
		hash.update(chunkTemplate.outputOptions.library + "");
	});
};
