Astro.Utils.EventData = function(type, data) {
  this.type = type;
  this.data = data;
  this.stopped = false;
};

var prototype = Astro.Utils.EventData.prototype;

prototype.stopPropagation = function() {
  this.stopped = true;
};
