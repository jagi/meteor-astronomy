Astronomy.Behavior({
  name: 'Sort',
  methods: {
    _getSelector: function() {
      var selector = {};

      selector.projectId = this.projectId;
      selector.parentLayerId = this.parentLayerId;

      return selector;
    },
    getTop: function() {
      var selector = this._getSelector();
      var options = {};

      options.sort = {};
      options.sort._position = -1;

      return Layers.findOne(selector, options);
    },
    takeOut: function() {
      // We can only take out documents that are already in the collection.
      if (!this._id) {
        return false;
      }

      var selector = this._getSelector();
      selector._position = {
        $gt: this._position
      };

      Layers.update(selector, {
        $inc: {
          _position: -1
        }
      }, {
        multi: true
      });

      this.remove();

      return true;
    },
    insertAt: function(position) {
      // We can only insert documents that are not already in the collection.
      // If you want to move document to another sorted queue you have to take
      // it out first using `takeOut` function.
      if (this._id) {
        return false;
      }

      // Get top layer in the given sorting queue.
      var top = this.getTop();
      if (top) {
        // Document can be inserted at position equal to position of the highest
        // document incremented by one.
        position = Math.min(top._position + 1, position);

        // Check whether we are insterting at the top of the stack or in the
        // middle of it.
        if (position <= top._position) {
          var selector = this._getSelector();
          selector._position = {
            $gte: position
          };
          Layers.update(selector, {
            $inc: {
              _position: 1
            }
          }, {
            multi: true
          });
        }
      } else {
        // If there are no documents, insert this one at 0 position.
        position = 0;
      }

      this._position = position;
      this.save();

      return true;
    },
    moveBy: function(shift) {
      return this.moveTo(this._position + shift);
    },
    moveTo: function(position) {
      // We can only move documents that are already in the collection.
      if (!this._id) {
        return false;
      }

      // Get most top layer in the sorted queue.
      var top = this.getTop();
      // Document can be moved to position equal to position of the highest one.
      position = Math.min(top._position, position);

      // Prepare selector.
      var selector = this._getSelector();
      // If new position is higher than the old one.
      if (position > this._position) {

        // Modify selector to move only certain documents.
        selector._position = {
          $gt: this._position, // Documents with position higher than the old one and...
          $lte: position // ... lower or equal to the new one.
        };
        // Move documents down.
        Layers.update(selector, {
          $inc: {
            _position: -1
          }
        }, {
          multi: true
        });

        // If new position is lower than the old one.
      } else if (position < this._position) {

        // Modify selector to move only certain documents.
        selector._position = {
          $gte: position, // Documents with position higher or equal to the new one and...
          $lt: this._position // ... lower than old one.
        };
        // Move documents up.
        Layers.update(selector, {
          $inc: {
            _position: 1
          }
        }, {
          multi: true
        });

        // If position have not changed, then stop execution.
      } else {
        return false;
      }

      this._position = position;
      this.save();

      return true;
    },
    moveUp: function() {
      return this.moveBy(+1);
    },
    moveDown: function() {
      return this.moveBy(-1);
    },
    moveToTop: function() {
      var top = this.getTop();

      return this.moveTo(top._position);
    },
    moveToBottom: function() {
      return this.moveTo(0);
    }
  }
});
