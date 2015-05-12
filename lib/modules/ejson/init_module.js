ejsonOnInitModule = function() {
  EJSON.addType('Astronomy', function(obj) {
    var Class = Classes[obj.class];
    var doc = new Class();
    doc._original = obj.original;
    doc._values = obj.values;
    return doc;
  });
};
