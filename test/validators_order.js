Tinytest.add('Validators - Order', function(test) {
  Astro.classes = [];

  ValidatorItem = Astro.Class({
    name: 'ValidatorItem',
    fields: [
      'first',
      'second',
      'third'
    ],
    validators: {
      'first': Validators.string(),
      'second': Validators.string(),
      'third': Validators.string()
    },
    validationOrder: [
      'third',
      'second',
      'first'
    ]
  });

  var validatorItem = new ValidatorItem();
  validatorItem.validate();
  var errors = validatorItem.getValidationErrors();

  test.isTrue(_.has(errors, 'third'),
    'The "third" validator should be run first');

  validatorItem.validate(false);
  var keys = _.keys(validatorItem.getValidationErrors());
  test.equal(keys, ['third', 'second', 'first'],
    'Validators should be run in the following order ' +
    '"third", "second", "first"'
  );
});
