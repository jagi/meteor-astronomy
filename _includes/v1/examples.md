# Examples

The best way to understand Astronomy is learning by an example, that's why there is an example git [repository](https://github.com/jagi/meteor-astronomy-examples) that you can clone and run to see Astronomy in action. The example repository has two branches [ironrouter](https://github.com/jagi/meteor-astronomy-examples/tree/ironrouter) and [flowrouter](https://github.com/jagi/meteor-astronomy-examples/tree/flowrouter) showing usage of Astronomy with two routing packages [IronRouter](https://atmospherejs.com/iron/router) and [FlowRouter](https://atmospherejs.com/meteorhacks/flow-router). I encourage you to take a look at the code to see how integration with form templates is done. ~~You can also take a look at working online example [here](http://astronomy.meteor.com).~~ (Not possible anymore because of termination of the free hosting by MDG)

**The Meteor.users collection**

If you want to provide a schema for the `Meteor.users` class then here is a minimal example of such definition. Of course, you could make it more detailed. However, Meteor takes care of checking data validity for the `Meteor.users` collection, so you don't have to do it one more time.

```js
UserProfile = Astro.Class({
  name: 'UserProfile',
  fields: {
    nickname: 'string'
    /* Any other fields you want to be published to the client */
  }
});

User = Astro.Class({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: 'date',
    emails: {
      type: 'array',
      default: function() {
        return [];
      }
    },
    profile: {
      type: 'object',
      nested: 'UserProfile',
      default: function() {
        return {};
      }
    }
  }
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: 'object'
    }
  });
}
```