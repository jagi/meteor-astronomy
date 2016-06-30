import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Class remove', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  Storage.remove(id);

  test.equal(Storage.find(id).count(), 0,
    'Document has not been removed properly'
  );
});
