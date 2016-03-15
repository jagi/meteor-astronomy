Package.describe({
  name: 'jagi:astronomy',
  version: '2.0.0-rc.6',
  summary: 'Model layer for Meteor',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript',
    'es5-shim',
    'ddp@1.2.2-beta.16',
    'mongo',
    'check',
    'minimongo',
    'ejson',
    'mdg:validation-error@0.5.1',
    'stevezhu:lodash@4.6.1',
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);

  // For backward compatibility.
  api.export('Astro', ['client', 'server']);
});

////////////////////////////////////////////////////////////////////////////////

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'ecmascript',
    'es5-shim',
    'insecure',
    'mongo',
    'ejson',
    'jagi:astronomy@2.0.0-rc.6',
    'stevezhu:lodash@4.6.1'
  ], ['client', 'server']);

  api.addFiles('test/utils.js', ['client', 'server']);
  // Core.
  api.addFiles([
    'test/core/inherit.js',
    'test/core/extend.js',
    'test/core/state.js',
    'test/core/ejson.js'
  ], ['client', 'server']);
  // Modules.
  // Modules - Behaviors.
  api.addFiles([
    'test/modules/behaviors/create.js',
    'test/modules/behaviors/apply.js'
  ], ['client', 'server']);
  // Modules - Validators.
  api.addFiles([
    'test/modules/validators/create.js',
    'test/modules/validators/apply.js',
    'test/modules/validators/validate.js'
  ], ['client', 'server']);
  // Modules - Storage.
  api.addFiles([
    'test/modules/storage/init.js',
  ], ['client', 'server']);
  api.addFiles([
    'test/modules/storage/client/transform.js',
    'test/modules/storage/client/document_insert.js',
    'test/modules/storage/client/document_update.js',
    'test/modules/storage/client/document_remove.js',
    'test/modules/storage/client/class_insert.js',
    'test/modules/storage/client/class_update.js',
    'test/modules/storage/client/class_remove.js',
    'test/modules/storage/client/reload.js',
    'test/modules/storage/client/copy.js'
  ], 'client');
  api.addFiles([
    'test/modules/storage/server/transform.js',
    'test/modules/storage/server/document_insert.js',
    'test/modules/storage/server/document_update.js',
    'test/modules/storage/server/document_remove.js',
    'test/modules/storage/server/class_insert.js',
    'test/modules/storage/server/class_update.js',
    'test/modules/storage/server/class_remove.js',
    'test/modules/storage/server/reload.js',
    'test/modules/storage/server/copy.js'
  ], 'server');
  // Modules - Events.
  api.addFiles([
    'test/modules/events/order.js',
    'test/modules/events/propagation.js',
    'test/modules/events/cancelable.js'
  ], ['client', 'server']);
  // Modules - Fields.
  api.addFiles([
    'test/modules/fields/definition.js',
    'test/modules/fields/default.js',
    'test/modules/fields/set.js',
    'test/modules/fields/get.js',
    'test/modules/fields/raw.js'
  ], ['client', 'server']);
  // Modules - Indexes.
  api.addFiles([
    // 'test/indexes/indexes_definition.js'
  ], 'server');
  // Modules - Methods.
  api.addFiles([
    // 'test/methods/methods_definition.js'
  ], ['client', 'server']);
});