# Global configuration

It's possible to configure some Astronomy behaviors using global configuration object `Astro.config`. You can also import configuration object `import { config } from 'meteor/jagi:astronomy'`.

Here is the list of all available configuration options:

- verbose - `true` by default - allows turning off deprecation warning
- resolving - `true` by default - allows turning off resolving values for performance gain
- defaults - `true` by default - allows turning off setting default values on documents fetch