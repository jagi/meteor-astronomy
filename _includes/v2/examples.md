# Examples

The best way to understand Astronomy is learning by an example, that's why there is an example git [repository](https://github.com/jagi/meteor-astronomy-examples/tree/v2) that you can clone and run to see Astronomy in action. The example repository shows usage of Astronomy with [FlowRouter](https://atmospherejs.com/meteorhacks/flow-router). I encourage you to take a look at the code to see how integration with form templates is done.

**The Meteor.users collection**

If you want to provide a schema for the `Meteor.users` class then here is a minimal example of such definition. Of course, you could make it more detailed. However, Meteor takes care of checking data validity for the `Meteor.users` collection, so you don't have to do it one more time.

```js
import { Class } from 'meteor/jagi:astronomy';

const UserProfile = Class.create({
  name: 'UserProfile',
  fields: {
    nickname: String
    /* Any other fields you want to be published to the client */
  }
});

const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    emails: {
      type: [Object],
      default: function() {
        return [];
      }
    },
    profile: {
      type: UserProfile,
      default: function() {
        return {};
      }
    }
  }
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: Object
    }
  });
}
```