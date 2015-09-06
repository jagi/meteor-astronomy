Tinytest.add('Storage - Direct remove', function(test) {
  // Get the "_id" property of the inserted document.
  var id = Storages.findOne({}, {
    transform: null
  })._id;

  if (Meteor.isClient) {
    test.equal(Storage.remove(id), 1,
      'Only one document should be removed on the client'
    );
  } else {
    test.equal(Storage.remove({}), 2,
      'All documents should be removed on the server'
    );
  }
});
