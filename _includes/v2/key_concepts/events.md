# Events

Astronomy is equipped with a full-fledged events system including events propagation. There are several predefined events but behaviors and modules creators can create their own events. All events are defined in the class schema. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* */
  events: {
    beforeSave(e) {
      /* Do something before saving document */
    }
  }
});
```

As you can see, an event handler function receives an event object as the first argument. It contains very useful data like event name (`type` property) or event occurrence time (`timeStamp` property) and more discussed below.

**Accessing document**

There are two properties in the event object through which you can access a document on which event occurred. There are `target` and `currentTarget`.

The `e.target` property stores a document on which event was originally triggered. So if you execute `user.save()` then in the `beforeSave` event the `target` property will the `user` document.

The `e.currentTarget` property stores a document on which event is actually executed. To better understand that let's take our common example with `User` and `Address` classes. Let's see the schema for the `Address` class which is a nested class in the `User`.

```js
import { Class } from 'meteor/jagi:astronomy';

const Address = Class.create({
  name: 'Address',
  fields: { /* ... */ },
  events: {
    beforeSave(e) {
      e.currentTarget;
    }
  }
});
```

Now, when you execute `user.save()` it will first trigger the `beforeSave` event on the `user` document (all `beforeSave` handlers for `User` will be executed) and later it will trigger the `beforeSave` event on each nested document including `user.address` (all `beforeSave` handlers for `Address` will be executed). The `e.currentTarget` property in the `beforeSave` handler in the `Address` class will point to the `user.address` nested document and `e.target` to the `user` document.

Taking all that into account, it's more likely that you will use `e.currentTarget` than `e.target`. The `e.target` property is most often used to retrieve a "parent" document from the nested one.

**The "trusted" property**

The `e.trusted` property is very important from the security point of view. You can read more about it in the [Security](#security) section. In this moment, you have to know that the `trusted` property indicates if e.g. the save operation was initiated on the server or not. If it was initiated on the server that it's "trusted" if on the client then it's not and we should validate user's permissions.

{% include v2/key_concepts/events/events_propagation.md %}

{% include v2/key_concepts/events/preventing_default.md %}

{% include v2/key_concepts/events/events_list.md %}