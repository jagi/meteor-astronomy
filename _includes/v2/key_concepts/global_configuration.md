# Global configuration

It's possible to configure some Astronomy behaviors using global configuration object `Astro.config`. You can access it by importing the `Astro` object `import { Astro } from 'meteor/jagi:astronomy'`.

Here is the list of all available configuration options:

- verbose - `true` by default - allows turning off deprecation warning
- resolving - `true` by default - allows turning off resolving values for performance gain
- defaults - `true` by default - allows turning off setting default values on documents fetch

And some example:

```js
import { Astro } from 'meteor/jagi:astronomy';

// Do not log deprection warnings.
Astro.config.verbose = false;
```
