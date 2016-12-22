# Rate limiting

Astronomy registers several [Meteor methods](https://guide.meteor.com/methods.html#what-is-a-method) which it uses internally. Like normal Meteor methods, they can be called from any client, and therefore should be safeguarded against flooding your server with method calls.

For that, you can use [ddp-rate-limiter](https://atmospherejs.com/meteor/ddp-rate-limiter). You will have to define rules for the specific names of methods registered by Astronomy and adjust the message and time interval limits according to your specific application requirements.

**Methods registered by Astronomy**

- `/Astronomy/execute`
- `/Astronomy/insert`
- `/Astronomy/remove`
- `/Astronomy/update`
- `/Astronomy/upsert`
- `/Astronomy/validate`

**Methods registered for softremove-behavior**

- `/Astronomy/softRemove`
- `/Astronomy/softRestore`

**An example rule with `ddp-rate-limiter`**

```js
// /server/lib/ratelimit.js
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

// Define method names you wish to create a rule for
const ASTRONOMY_METHODS = [
  '/Astronomy/execute',
  '/Astronomy/insert',
  '/Astronomy/remove',
  '/Astronomy/update',
  '/Astronomy/upsert',
  '/Astronomy/validate'
];

// Add new rule
DDPRateLimiter.addRule({
  name(name) {
    // Match methods registered by Astronomy
    return _.contains(ASTRONOMY_METHODS, name);
  },
  // Limit per DDP connection
  connectionId() { return true; }
}, 5, 1000); // Allow 5 messages per second
```