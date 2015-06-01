Astro.Event = function(type, data) {
  this.type = type;
  this.data = data;
};

_.extend(Astro.Event.prototype, {
  type: null,
  data: null,
  stopped: false,
  defaultPrevented: false,

  stopPropagation: function() {
    this.stopped = true;
  },

  preventDefault: function() {
    this.defaultPrevented = true;
  }
});
