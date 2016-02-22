import documentValidate from '../utils/document_validate.js';

function validate(doc, fieldsNames, stopOnFirstError) {
	return documentValidate(doc, fieldsNames, stopOnFirstError);
};

export default validate;