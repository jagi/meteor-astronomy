Astronomy.Behavior({
  name: 'Timestamp',
  fields: {
    createdAt: null,
    updatedAt: null
  },
  events: {
    beforeInsert: function() {
      this.createdAt = new Date();
    },
    beforeUpdate: function() {
      this.updatedAt = new Date();
    }
  }
});
