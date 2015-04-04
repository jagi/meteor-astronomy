Package.describe({
  summary: 'Model layer for Meteor',
  version: '0.1.0',
  name: 'jagi:astronomy',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('mongo');
  api.use('minimongo');
  api.use('underscore');

  api.addFiles('lib/global.js', ['client', 'server']);
  api.addFiles('lib/utils.js', ['client', 'server']);
  api.addFiles('lib/schema.js', ['client', 'server']);
  api.addFiles('lib/class.js', ['client', 'server']);
  api.addFiles('lib/module.js', ['client', 'server']);

  // Module - Fields.
  api.addFiles('lib/modules/fields/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/main.js', ['client', 'server']);
  // Module - Methods.
  api.addFiles('lib/modules/methods/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/methods/main.js', ['client', 'server']);
  // Module - Events.
  api.addFiles('lib/modules/events/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/events/main.js', ['client', 'server']);
  // Module - Validators.
  api.addFiles('lib/modules/validators/global.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/error.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/validator.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/main.js', ['client', 'server']);
  // Module - Behaviors.
  api.addFiles('lib/modules/behaviors/global.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/behavior.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/main.js', ['client', 'server']);

  // Validators.
  api.addFiles('lib/validators/number.js', ['client', 'server']);

  // Behaviors.
  api.addFiles('lib/behaviors/nestedset/node.js', ['client', 'server']);
  api.addFiles('lib/behaviors/nestedset/nestedset.js', ['client', 'server']);
  api.addFiles('lib/behaviors/sort/sort.js', ['client', 'server']);
  api.addFiles('lib/behaviors/timestamp/timestamp.js', ['client', 'server']);

  api.export(['Astro', 'Astronomy'], ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');

  api.use('mongo');
  api.use('minimongo');
  api.use('underscore');

  api.addFiles('lib/global.js', ['client', 'server']);

  // Schema.
  api.addFiles('lib/schema/schema.js', ['client', 'server']);
  api.addFiles('lib/schema/fields.js', ['client', 'server']);
  api.addFiles('lib/schema/methods.js', ['client', 'server']);
  api.addFiles('lib/schema/events.js', ['client', 'server']);
  api.addFiles('lib/schema/validators.js', ['client', 'server']);
  api.addFiles('lib/schema/behaviors.js', ['client', 'server']);
  api.addFiles('lib/model.js', ['client', 'server']);
  api.addFiles('lib/transform.js', ['client', 'server']);
  api.addFiles('lib/error.js', ['client', 'server']);

  // Behaviors.
  api.addFiles('lib/behaviors/behavior.js', ['client', 'server']);
  api.addFiles('lib/behaviors/nestedset/node.js', ['client', 'server']);
  api.addFiles('lib/behaviors/nestedset/nestedset.js', ['client', 'server']);
  api.addFiles('lib/behaviors/sort/sort.js', ['client', 'server']);

  api.addFiles('test/fields.js', ['client', 'server']);
});
