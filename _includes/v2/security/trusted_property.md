# Trusted property

**Distinguishing between client and server initiated mutations**

Astronomy’s event system automatically provides an extra property on every event called `trusted`.

The `trusted` property indicates if the current invocation of your event handler was triggered by a mutation requested by client-side code (should not be trusted and must pass security checks) or server-side code (presumably trusted).

If you omit the `insecure` package from your app and do not add any allow/deny rules for the `Mongo.Collection` managed by your Astronomy model, this allows you to implement all access control rules directly in Astronomy event hooks.

**IMPORTANT NOTES**

1. Your event hooks **must** be defined on the server so they can run on the server. They may optionally also be defined on the client.
2. If client-side code calls `save()` or `remove()` on an Astronomy model, both the event hook that runs on the client and the event hook that runs on the server will have `e.trusted` set to `false`.
3. If server-side code calls `save()` or `remove()` on an Astronomy model, the event hook will not run on the client, and the event hook that runs on the server will have `e.trusted` set to `true`.
4. If you write your own custom Meteor Method on both the client and the server which internally calls `save()` or `remove()` on an Astronomy model, your custom method will be run by Meteor on both the client and the server. This is how Meteor works. When your method is run on the server and calls `save()` or `remove()`, the `e.trusted` property will be true since the call to `save()` or `remove()` will have been initiated by the server-side version of your custom Meteor method.

**Example implementation on insert**

```js
// server/models/car.js
import { Class } from 'meteor/jagi:astronomy';

const Car = Class.create({
  name: 'Car',
  /* ... */
  events: {
    beforeInsert: [
      function checkUserID(e) {
        const car = e.currentTarget;
        if (!e.trusted) {
          // Request to insert came from client-code.
          // Run security checks.
          if (/* Check doesn't pass */) {
            throw new Meteor.Error(
              "not-allowed",
              "You don't have sufficient permissions to create a car."
            );
          }
        }
        else {
          // Request to insert came from server-code.
        }
      },
      function checkSomethingICareAbout(e) {
        // Some other kind of check, possibly using `e.trusted` to determine
        // if we need to run the check
      }
    ]
  }
});
```

Documentation to be included as part of the API doc of the event’s properties...

trusted: (boolean) false if the event was triggered by client-side code, true otherwise (link to further explanation of this property)
