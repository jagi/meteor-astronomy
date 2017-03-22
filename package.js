Package.describe({
  name: 'jagi:astronomy',
  version: '2.4.2',
  summary: 'Model layer for Meteor',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Npm.depends({
  lodash: '4.17.4'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'ddp',
    'mongo',
    'check',
    'minimongo',
    'ejson',
    'mdg:validation-error@0.5.1'
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);

  // For backward compatibility.
  api.export('Astro', ['client', 'server']);
});

////////////////////////////////////////////////////////////////////////////////

Package.onTest(function(api) {
  api.use([
    'practicalmeteor:mocha',
    'tinytest',
    'ecmascript',
    'es5-shim',
    'insecure',
    'mongo',
    'ejson',
    'jagi:astronomy@2.4.2'
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
    'test/modules/validators/validate.js',
    'test/modules/validators/validate_callback.js'
  ], ['client', 'server']);
  // Modules - Storage.
  api.addFiles([
    'test/modules/storage/is_new.js',
    'test/modules/storage/init.js',
    'test/modules/storage/type_field.js',
    'test/modules/storage/transform.js',
    'test/modules/storage/document_insert.js',
    'test/modules/storage/document_update.js',
    'test/modules/storage/document_remove.js',
    'test/modules/storage/class_insert.js',
    'test/modules/storage/class_update.js',
    'test/modules/storage/class_remove.js',
    'test/modules/storage/reload.js',
    'test/modules/storage/copy.js',
  ], ['client', 'server']);
  // Modules - Events.
  api.addFiles([
    'test/modules/events/order.js',
    'test/modules/events/propagation.js',
    'test/modules/events/cancelable.js'
  ], ['client', 'server']);
  // Modules - Fields.
  api.addFiles([
    'test/modules/fields/cast.js',
    'test/modules/fields/default.js',
    'test/modules/fields/definition.js',
    'test/modules/fields/get.js',
    'test/modules/fields/merge.js',
    'test/modules/fields/optional.js',
    'test/modules/fields/raw.js',
    'test/modules/fields/set.js'
  ], ['client', 'server']);
  // Modules - Indexes.
  api.addFiles([
    // 'test/indexes/indexes_definition.js'
  ], 'server');
  // Modules - Methods.
  api.addFiles([
    'test/modules/helpers/definition.js'
  ], ['client', 'server']);
});