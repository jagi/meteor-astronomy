Tinytest.add('Storage - Copy', function(test) {
  let storage = Storage.findOne();

  let clone = storage.copy();
  test.isNull(clone._id,
    'In the cloned document a value of the "_id" field should be null'
  );

  clone = storage.copy(true);
  test.isNotNull(clone._id,
    'In the saved cloned document a value of the "_id" field should not be null'
  );
  test.notEqual(clone._id, storage._id,
    'The "_id" fields of the original and cloned documents should not be equal'
  );
  test.equal(_.omit(clone.raw(), '_id'), _.omit(storage.raw(), '_id'),
    'All values (except the "_id" field) of the original and cloned ' +
    'documents should be equal'
  );
});
