Tinytest.add('Events - Order', function(test) {
  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeInsert 1',
    'beforeInsert 2',
    'beforeInsert global',
    'afterInsert 1',
    'afterInsert 2',
    'afterInsert global',
    'afterSave 1',
    'afterSave 2',
    'afterSave global'
  ];
  var event = new Event();
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document insert'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeUpdate 1',
    'beforeUpdate 2',
    'beforeUpdate global'
  ];
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document update without a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSet 1',
    'beforeSet 2',
    'beforeSet global',
    'afterSet 1',
    'afterSet 2',
    'afterSet global',
    'beforeGet 1',
    'beforeGet 2',
    'beforeGet global',
    'afterGet 1',
    'afterGet 2',
    'afterGet global',
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeUpdate 1',
    'beforeUpdate 2',
    'beforeUpdate global',
    'afterUpdate 1',
    'afterUpdate 2',
    'afterUpdate global',
    'afterSave 1',
    'afterSave 2',
    'afterSave global'
  ];
  event.set('childField', 'update');
  event.get('childField');
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document update after a change'
  );
});
