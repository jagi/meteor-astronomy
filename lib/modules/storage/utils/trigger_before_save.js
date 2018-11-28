import Event from "../../events/event.js";

function triggerBeforeSave(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "beforeSave" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeSave", {
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
      eventName: "beforeSave"
    });
  }
}

export default triggerBeforeSave;
