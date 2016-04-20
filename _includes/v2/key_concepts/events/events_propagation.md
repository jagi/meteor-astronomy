# Events propagation

When you add an event handler for the same event on two levels: on the class level and on the global level, then which event handler will be called first? You have to look for the answer in the events propagation.

Here is the order in which events are triggered:

1. Parent class event
2. Child class event
3. Global event

You will learn about inheritance in the following sections of this documentation. For know, you have to know that events are triggered in the order showed above.

In any moment, we can stop execution of event handlers to come by calling the `stopPropagation()` method on an event object passed to the event handler. The example below shows how to stop execution of the global event during the execution of the event handler on the class level.

```js
User = Astro.Class({
  name: 'User',
  /* */
  events: {
    'eventName': function(e) {
      alert('Class event handler');
      e.stopPropagation();
    }
  }
});

Astro.eventManager.on('eventName', function(e) {
  // This event will never be called, because propagation was stopped.
  alert('Global event handler');
});
```