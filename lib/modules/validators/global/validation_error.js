Validators = {};
Validators.maxLength = function(doc, fieldName, param) {
  let fieldValue = doc[fieldName];
  if (fieldValue && fieldValue.length > param) {
    doc.addError(
      fieldName, 'The value of the "' + fieldName + '" field is too long'
    );
    return false;
  }
  return true;
};

Astro.ValidationError = class ValidationError extends Error {
  constructor(data) {
    super(data);

    this.name = 'ValidationError';
    this.stack = (new Error()).stack;
    this.document = data.document;
    this.fieldValidator = data.fieldValidator;
    this.fieldName = data.fieldName;
    this.fieldValue = data.fieldValue;
    this.param = data.param;
  }
};