# Building with Astronomy

The usefulness of Astronomy comes from its ability to help maintain the integrity of your data and also to organize the code related to your model layer. It can serve as basic documentation of your collections and the properties that documents in those collections have.

Before deep-diving into the API docs, let’s take a look at what a full-fledged model in Astronomy looks like to demonstrate most of the capabilities of Astronomy in one place and show how they can work together.

Let’s assume we are building a chat-type app that has a central model called "Conversations". Here’s what that model might look like in `<your app>/lib/models/conversation.js`.

```js
// Flag for determining who (by default) can see what conversations.
const Visibility = Enum.create({
  name: 'Visibility',
  options: {
    PUBLIC: 0,
    PRIVATE: 1,
    INVITE_ONLY: 2
  }
});

// Sub-model for keeping track of a user
// that is participating in a conversation.
const Participant = Class.create({
  name: 'Participant',
  behaviors: ['timestamp'],
  fields: {
    userId: {
      type: String
    },
    status: {
      type: String
    }
  }
});

// Helper function for making sure that the
// request is coming from the server directly,
// or that it is coming from an authenticated user.
function mustBeLoggedIn(e) {
  if (!e.trusted && !Meteor.userId()) {
    // Anonymous client is trying to create a conversation.
    throw new Meteor.Error(
      'must-be-logged-in',
      'You must have an account to create a new Conversation.'
    );
  }
}

// A Conversation represents one or more users who are talking together.
// This model contains all the "metadata" about the conversation, while
// actual messages are stored in the Message collection.
const Conversation = Class.create({
  name: 'Conversation',
  collection: new Mongo.Collection('conversations'),
  behaviors: ['timestamp'],
  fields: {
    /**
     * The userId of the user who created the conversation, or 'SYSTEM'
     * if created by the app.
     **/
    ownerId: {
      type: String,
      default () {
        return Meteor.userId() || 'SYSTEM';
      },
      immutable: true
    },
    /**
     * A catch-all property to store custom extra info per conversation.
     **/
    metadata: {
      type: Object,
      default () {
        return {};
      }
    },
    /**
     * Basic access-control flag.
     **/
    visibility: {
      type: Visibility,
      default: Visibility.PUBLIC
    },
    /**
     * Users who are interested in this conversation.
     **/
    participants: {
      type: [Participant],
      default () {
        if (Meteor.userId()) {
          return [
            new Participant({
              userId: Meteor.userId()
            })
          ];
        }
        else {
          return [];
        }
      }
    }
  },
  indexes: {
    // make sure we can quickly find by ownerId
    ownerIdIndex: {
      fields: {
        ownerId: 1
      }
    },
    // make sure we can quickly find by visibility
    visibilityIndex: {
      fields: {
        visibility: 1
      }
    }
  },
  events: {
    beforeInsert: mustBeLoggedIn,
    beforeUpdate: [
      mustBeLoggedIn,
      function mustBeAParticipant(e) {
        if (e.trusted) {
          return; // allow all updates made by the server
        }

        var conversation = e.currentTarget;
        var userId = Meteor.userId();
        var participant = _.find(
          conversation.participants,
          function(participant) {
            return participant.userId === userId;
          }
        );

        if (!participant) {
          throw new Meteor.Error(
            'must-be-participant',
            'You must have already joined the conversation to do that.'
          );
        }
      },
      function visibilityCanOnlyBeSetByOwner(e) {
        if (e.trusted) {
          return; // allow all updates made by the server
        }

        var conversation = e.currentTarget;
        var modifiedFields = conversation.getModified();

        if (
          _.contains(modifiedFields, 'visibility') &&
          Meteor.userId() !== conversation.ownerId
        ) {
          throw new Meteor.Error(
            'must-be-owner',
            'You cannot change the visibility of this conversation ' +
            'since you are not its owner.'
          );
        }
      }
    ],
    beforeRemove: function disallowRemoveConversation(e) {
      throw new Meteor.Error(
        'cannot-remove-conversation',
        'Conversations may not be deleted.'
      );
    }
  },
  helpers: {
    /**
     * Get all the messages for this conversation, sorted by most recent.
     */
    messages() {
      // assuming we have another Astronomy Model for our conversation's messages
      return Message.find({
        conversationId: this._id
      }, {
        sort: {
          createdAt: 1
        }
      });
    },
    /**
     * Convenience helper for sending a message to everyone in this conversation.
     **/
    send(content, callback) {
      var message = new Message({
        userId: Meteor.userId(),
        conversationId: this._id,
        content: content
      });
      return message.save(callback);
    },
    /**
     * Adds a user to this conversation's participants.
     **/
    join(userId, callback) {
      if (_.isFunction(userId)) {
        callback = userId;
        userId = null;
      }

      userId = userId || Meteor.userId();

      if (!userId) {
        return callback && callback(
          new Error('Invalid user, cannot join conversation.')
        );
      }

      return Conversation.update(this._id, {
        $push: {
          participants: new Participant({
            userId: userId
          })
        }
      }, callback);
    }
  }
});
```

**Creating a conversation**

```js
var conversation = new Conversation();
conversation.save();
```

**Sending a message to everyone in this conversation**

```js
var conversation = Conversation.findOne(<a conversation._id>);
conversation.send("I think I'm getting the hang of this...");
```

**Joining a conversation as a logged in user**

```js
var conversation = Conversation.findOne(<a conversation._id>);
conversation.join(function(err){ ... });
```

**Server adds a user to a conversation**

```js
var conversation = Conversation.findOne(<a conversation._id>);
conversation.join(<a user._id>);
```

**Get all the messages for a conversation**

```js
var conversation = Conversation.findOne(<a conversation._id>);
conversation.messages();
```

**Notes**

This gets you pretty far along. In slightly more advanced code, this is what would change:

1. The `mustBeLoggedIn` function would be placed into an namespace like `Auth.mustBeLoggedIn` so that it could be re-used across multiple models and unit tested.
2. The internals of the methods like send and join would be placed into separate utility functions so that they could be easily unit tested and the methods attached to the model would simply reference them.