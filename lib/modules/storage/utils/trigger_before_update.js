import Event from "../../events/event.js";

function triggerBeforeUpdate(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "beforeUpdate" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeUpdate", {
        cancelable: true,
        propagates: true,
        doc,
        stopOnFirstError,
        fields,
        simulation,
        forceUpdate,
        trusted,
        oldDoc
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeUpdate"
    });
  }
}

export default triggerBeforeUpdate;
