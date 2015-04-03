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

  // Schema.
  api.addFiles('lib/utils.js', ['client', 'server']);
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
