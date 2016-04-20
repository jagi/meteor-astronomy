# Events

Astronomy is equipped with a full-fledged events system including events propagation. There are several predefined events but behaviors and modules creators can create their own events.

We can define events on the level of the class or on the global level. Let's take a look at the example.

**Define events on the class level**

```js
User = Astro.Class({
  name: 'User',
  /* */
  events: {
    'eventName': function(e) {
      /* Do something on the event occurrence */
    }
  }
});
```

As you can see, an event handler function receives an event object as a first argument. For most events it only contains information about an event name and two useful functions: `e.stopPropagation()` and `e.preventDefault()`. The context ```this``` of the event function is the document on which the event was triggered. We will talk more about them in next sections.

**Define events on the global level**

Now, take a look at how to define events on the global level:

```js
Astro.eventManager.on('eventName', function(e) {
  /* Do something on the event occurrence */
});
```

{% include v1/key_concepts/events/events_propagation.md %}

{% include v1/key_concepts/events/preventing_default.md %}

{% include v1/key_concepts/events/storage_events.md %}

{% include v1/key_concepts/events/modification_events.md %}

{% include v1/key_concepts/events/initialization_events.md %}

{% include v1/key_concepts/events/other_events.md %}
