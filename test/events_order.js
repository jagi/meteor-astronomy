Tinytest.add('Events - Order', function(test) {
  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeInsert 1 on parent',
    'beforeInsert 2 on parent',
    'beforeInsert global',
    'afterInsert 1 on parent',
    'afterInsert 2 on parent',
    'afterInsert global',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  var parentOrder = new ParentEvent();
  parentOrder.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a parent document insert'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global'
  ];
  parentOrder.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a parent document update without a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSet 1 on parent',
    'beforeSet 2 on parent',
    'beforeSet global',
    'afterSet 1 on parent',
    'afterSet 2 on parent',
    'afterSet global',
    'beforeGet 1 on parent',
    'beforeGet 2 on parent',
    'beforeGet global',
    'afterGet 1 on parent',
    'afterGet 2 on parent',
    'afterGet global',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global',
    'afterUpdate 1 on parent',
    'afterUpdate 2 on parent',
    'afterUpdate global',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  parentOrder.set('parentField', 'update');
  parentOrder.get('parentField');
  parentOrder.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a parent document update after a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeInsert 1 on child',
    'beforeInsert 2 on child',
    'beforeInsert 1 on parent',
    'beforeInsert 2 on parent',
    'beforeInsert global',
    'afterInsert 1 on child',
    'afterInsert 2 on child',
    'afterInsert 1 on parent',
    'afterInsert 2 on parent',
    'afterInsert global',
    'afterSave 1 on child',
    'afterSave 2 on child',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  var childEvent = new ChildEvent();
  childEvent.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document insert'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on child',
    'beforeUpdate 2 on child',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global'
  ];
  childEvent.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document update without a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSet 1 on child',
    'beforeSet 2 on child',
    'beforeSet 1 on parent',
    'beforeSet 2 on parent',
    'beforeSet global',
    'afterSet 1 on child',
    'afterSet 2 on child',
    'afterSet 1 on parent',
    'afterSet 2 on parent',
    'afterSet global',
    'beforeGet 1 on child',
    'beforeGet 2 on child',
    'beforeGet 1 on parent',
    'beforeGet 2 on parent',
    'beforeGet global',
    'afterGet 1 on child',
    'afterGet 2 on child',
    'afterGet 1 on parent',
    'afterGet 2 on parent',
    'afterGet global',
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on child',
    'beforeUpdate 2 on child',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global',
    'afterUpdate 1 on child',
    'afterUpdate 2 on child',
    'afterUpdate 1 on parent',
    'afterUpdate 2 on parent',
    'afterUpdate global',
    'afterSave 1 on child',
    'afterSave 2 on child',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  childEvent.set('childField', 'update');
  childEvent.get('childField');
  childEvent.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a child document update after a change'
  );
});
