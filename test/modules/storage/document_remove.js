import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Document remove', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  const storage = Storage.findOne(id);
  storage.remove();

  test.equal(Storage.find(id).count(), 0,
    'The document has not been removed properly'
  );
});
