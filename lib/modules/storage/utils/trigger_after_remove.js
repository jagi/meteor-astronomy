import Event from "../../events/event.js";

function triggerAfterRemove(args) {
  const { doc, simulation, trusted } = args;
  // Trigger the "afterRemove" event handlers.
  doc.dispatchEvent(
    new Event("afterRemove", {
      propagates: true,
      doc,
      simulation,
      trusted
    })
  );
}

export default triggerAfterRemove;
