let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods.update = function(Class, args, originalMethod) {
  let Collection = Class.getCollection();
  let selector = args[0];
  let modifier = args[1];
  // Cloning the third argument prevents from setting a callback function to the
  // "options" variable.
  let options = _.clone(args[2]) || {};
  // Pull off any callback (or perhaps a 'callback' variable that was passed
  // in undefined, like how 'upsert' does it).
  let callback;
  let lastArg = args[args.length - 1];
  if (lastArg instanceof Function) {
    callback = lastArg;
  }

  // Throw exception if we are trying to update more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'update');

  let docs;
  if (options.multi) {
    docs = Collection.find(selector);
  } else {
    docs = Collection.find(selector, {limit: 1});
  }

  let result = 0;
  docs.forEach(function(doc, index) {
    // Apply $set modifier.
    if (modifier.$set) {
      _.each(modifier.$set, function(fieldValue, fieldPattern) {
        doc._setOne(fieldPattern, fieldValue);
      });
    }
    // Apply $inc modifier.
    if (modifier.$inc) {
      _.each(modifier.$inc, function(incValue, fieldPattern) {
        let fieldValue = doc._getOne(fieldPattern);
        doc._setOne(fieldPattern, fieldValue + incValue);
      });
    }

    // FIXME: Solve problem of many different modifiers and casting values.
    Astro.utils.fields.castNested(doc);

    // Trigger the "beforeSave" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      return;
    }
    // Trigger the "beforeUpdate" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeUpdate', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      return;
    }

    // Get modified values.
    let modified = doc.getModified();
    // If there were any modifications.
    if (_.size(modified) > 0) {
      // FIXME: There is Meteor error. When called on the server with the
      // callback function it returns undefined instead number of documents that
      // got modified. It work properly in the "insert" method. Right now we
      // have to use the hack.

      // Execute the original method.
      let clientResult = originalMethod.call(this, {_id: doc._id}, {
        $set: modified
      }, callback);
      if (Meteor.isServer) {
        result++;
      } else {
        result += clientResult;
      }
    }
    // No fields were modified, so we just go to the next document.
    else {
      if (callback instanceof Function) {
        callback(undefined, 0);
      }
      return;
    }

    // Trigger the "afterUpdate" event handlers.
    doc.dispatchEvent(new Astro.Event('afterUpdate', {
      propagates: true
    }));
    // Trigger the "afterSave" event handlers.
    doc.dispatchEvent(new Astro.Event('afterSave', {
      propagates: true
    }));
  }, this);

  return result;
};