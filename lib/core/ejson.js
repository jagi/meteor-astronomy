import AstroClass from './class.js';
import Event from '../modules/events/event.js';

EJSON.addType('Astronomy', function(json) {
  let Class = AstroClass.get(json.class);
  let doc = new Class();

  // Trigger the "fromJSONValue" event handlers.
  doc.dispatchEvent(new Event('fromJSONValue', {
    json: json
  }));

  return doc;
});