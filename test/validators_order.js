Tinytest.add('Validators - Order', function(test) {
  Astro.classes = [];

  ValidatorOrder = Astro.Class({
    name: 'ValidatorOrder',
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

  var validatorOrder = new ValidatorOrder();
  validatorOrder.validate();
  var errors = validatorOrder.getValidationErrors();

  test.isTrue(_.has(errors, 'third'),
    'The "third" validator should be run first');

  validatorOrder.validate(false);
  var keys = _.keys(validatorOrder.getValidationErrors());
  test.equal(keys, ['third', 'second', 'first'],
    'Validators should be run in the following order ' +
    '"third", "second", "first"'
  );
});
