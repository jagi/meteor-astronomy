Astro.EventData = function(data) {
  this.data = data;
  this.stopped = false;
};

var prototype = Astro.EventData.prototype;

prototype.stopPropagation = function() {
  this.stopped = true;
};
