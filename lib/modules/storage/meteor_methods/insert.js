let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/insert'] = function(className, values) {
	return Astro.utils.storage.classInsert(className, values);
};