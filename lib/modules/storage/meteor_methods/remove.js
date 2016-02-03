let methods = Astro.Module.modules.storage.meteorMethods;

methods['/Astronomy/remove'] = function(className, selector) {
	return Astro.utils.storage.classRemove(className, selector);
};