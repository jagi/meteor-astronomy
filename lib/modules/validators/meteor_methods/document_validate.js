let methods = Astro.Module.modules.validators.meteorMethods;

methods['/Astronomy/documentValidate'] = function(
	doc, fieldsNames, stopOnFirstError
) {
  return Astro.utils.validators.documentValidate(
		doc, fieldsNames, stopOnFirstError
	);
};