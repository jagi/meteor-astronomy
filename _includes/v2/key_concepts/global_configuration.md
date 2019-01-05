# Global configuration

It's possible to configure some Astronomy behaviors using global configuration object `Astro.config`. You can access it by importing the `Astro` object `import { Astro } from 'meteor/jagi:astronomy'`.

You can also import config object directly `import { config } from 'meteor/jagi:astronomy'`.

Here is the list of all available configuration options:

- `config.verbose = false;` - Turn off all warnings.
- `config.resolving = false;` - Turn off resolving values for performance gain.
- `config.defaults = false;` - Turn off setting default values on documents fetch.
- `config.logs.deprecation = false;` // Turn off deprecation warnings.
- `config.logs.nonExistingField = false;` // Turn off warnings about non existing fields.
- `config.logs.classDuplicate = false;` // Turn off class duplication warnings.
- `config.logs.typeDuplicate = false;` // Turn off type duplication warnings.

Example:

```js
import { config } from 'meteor/jagi:astronomy';

// Do not log warnings.
config.verbose = false;
```
