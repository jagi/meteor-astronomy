Astronomy.Behavior({
  name: 'NestedSet',
  methods: {
    getNode: function() {
      if (!this._node) {
        this._node = new Node(this);
      }

      return this._node;
    }
  }
});
