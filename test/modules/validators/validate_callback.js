Tinytest.addAsync('Modules - Validators - ValidateWithCallback', function(test, onComplete) {
    let ClassValidatorAsync = Astro.Class.create({
        name: 'ClassValidatorAsync',
        fields: {
            nameA: {
                type: String
            }
        }
    });

    let docValidatorAsync = new ClassValidatorAsync();

    docValidatorAsync.nameA = {};

    // Validate with callback
    docValidatorAsync.validate({ fields: 'nameA' }, function(validationError) {
        test.isNotUndefined(validationError, 'Document not validated properly');
        onComplete();
    });
});