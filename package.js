Package.describe({
  summary: 'Model layer for Meteor',
  version: '0.2.0',
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
  api.addFiles('lib/module.js', ['client', 'server']);
  api.addFiles('lib/class.js', ['client', 'server']);
  // Fields module.
  api.addFiles('lib/modules/fields/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/module.js', ['client', 'server']);
  // Methods module.
  api.addFiles('lib/modules/methods/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/methods/module.js', ['client', 'server']);
  // Events module.
  api.addFiles('lib/modules/events/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/events/module.js', ['client', 'server']);
  // Validators module.
  api.addFiles('lib/modules/validators/global.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/error.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/validator.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/module.js', ['client', 'server']);
  // Behaviors module.
  api.addFiles('lib/modules/behaviors/global.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/behavior.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/module.js', ['client', 'server']);
  // Validators.
  api.addFiles('lib/validators/number.js', ['client', 'server']);
  api.addFiles('lib/validators/string.js', ['client', 'server']);
  api.addFiles('lib/validators/regex.js', ['client', 'server']);
  api.addFiles('lib/validators/email.js', ['client', 'server']);
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
  api.addFiles('lib/utils.js', ['client', 'server']);
  api.addFiles('lib/schema.js', ['client', 'server']);
  api.addFiles('lib/module.js', ['client', 'server']);
  api.addFiles('lib/class.js', ['client', 'server']);
  // Fields module.
  api.addFiles('lib/modules/fields/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/module.js', ['client', 'server']);
  // Methods module.
  api.addFiles('lib/modules/methods/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/methods/module.js', ['client', 'server']);
  // Events module.
  api.addFiles('lib/modules/events/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/events/module.js', ['client', 'server']);
  // Validators module.
  api.addFiles('lib/modules/validators/global.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/error.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/validator.js', ['client', 'server']);
  api.addFiles('lib/modules/validators/module.js', ['client', 'server']);
  // Behaviors module.
  api.addFiles('lib/modules/behaviors/global.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/schema.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/behavior.js', ['client', 'server']);
  api.addFiles('lib/modules/behaviors/module.js', ['client', 'server']);
  // Validators.
  api.addFiles('lib/validators/number.js', ['client', 'server']);
  // Behaviors.
  api.addFiles('lib/behaviors/nestedset/node.js', ['client', 'server']);
  api.addFiles('lib/behaviors/nestedset/nestedset.js', ['client', 'server']);
  api.addFiles('lib/behaviors/sort/sort.js', ['client', 'server']);
  api.addFiles('lib/behaviors/timestamp/timestamp.js', ['client', 'server']);

  api.addFiles('test/fields.js', ['client', 'server']);
});
