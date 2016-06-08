import _ from 'lodash';

Tinytest.add('Fields - Modules - Optional', function(test) {
  reset();

  // Define simple class to work with.
  let Default = Astro.Class.create({
    name: 'Default',
    fields: {
      firstField: {
        type: String,
        default: ''
      },
      secondField: {
        type: String,
        optional: function(doc) {
          return this.firstField.length;
        }
      }
    }
  });

  let doc = new Default();

  test.equal(Default.getField('firstField').optional, 
     false,
    'optional for "firstField" should return false'
  );

  test.equal(_.isFunction(Default.getField('secondField').optional), 
     true,
    'optional for field "secondField" should be a function'
  );
});