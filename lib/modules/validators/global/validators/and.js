Validators.and = function(doc, name, validators) {
  let value = doc.get(name);

  _.every(validators, function(param, validatorName) {
    console.log(validatorName, param);
  });
};