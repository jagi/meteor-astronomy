Node = function(doc) {
  this._doc = doc;
};

Node.prototype = {};

Node.prototype.getPropertyName = function(name) {
  switch (name) {
    case 'left':
      return '_left';
    case 'right':
      return '_right';
    case 'depth':
      return '_depth';
    case 'root':
      return '_root';
  }
};

Node.prototype.getDoc = function() {
  return this._doc;
};

Node.prototype.isValidNode = function() {
  return this.getRightValue() > this.getLeftValue();
};

Node.prototype.isRoot = function() {
  return this.getLeftValue() === 1;
};

Node.prototype.isLeaf = function() {
  return this.getRightValue() - this.getLeftValue() === 1;
};

Node.prototype.hasChildren = function() {
  return (this.getRightValue() - this.getLeftValue()) > 1;
};

Node.prototype.hasParent = function() {
  return this.isValidNode() && !this.isRoot();
};

Node.prototype.getParent = function(selector) {
  selector = selector || {};

  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');
  var depthProp = this.getPropertyName('depth');

  selector[rootProp] = this.getRootValue();
  selector[leftProp] = {
    $lt: this.getLeftValue()
  };
  selector[rightProp] = {
    $gt: this.getRightValue()
  };
  selector[depthProp] = {
    $gte: this.getDepthValue() - 1
  };

  return Layers.findOne(selector);
};

Node.prototype.hasPrevSibling = function() {
  var prev = this.getPrevSibling();
  return prev && this.isValidNode(prev);
};

Node.prototype.hasNextSibling = function() {
  var next = this.getNextSibling();
  return next && this.isValidNode(next);
};

Node.prototype.getPrevSibling = function() {
  var selector = {};

  var rootProp = this.getPropertyName('root');
  var rightProp = this.getPropertyName('right');

  selector[rootProp] = this.getRootValue();
  selector[rightProp] = this.getLeftValue() - 1;

  return Layers.findOne(selector);
};

Node.prototype.getNextSibling = function() {
  var selector = {};

  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');

  selector[rootProp] = this.getRootValue();
  selector[leftProp] = this.getRightValue() + 1;

  return Layers.findOne(selector);
};

Node.prototype.getSiblings = function(includeThis) {
  var self = this;
  var siblings = [];

  includeThis = includeThis || false;

  if (!this.hasParent()) {
    return siblings;
  }

  var parent = this.getParent();
  parent.getNode().getChildren().forEach(function(child) {
    if (self._id === child._id && !includeThis) {
      return;
    }
    siblings.push(child);
  });

  return siblings;
};

Node.prototype.getDescendants = function(depth, includeThis, selector) {
  selector = selector || {};
  var options = {};

  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');
  var depthProp = this.getPropertyName('depth');

  if (includeThis) {
    selector[leftProp] = {
      $gte: this.getLeftValue()
    };
    selector[rightProp] = {
      $lte: this.getRightValue()
    };
  } else {
    selector[leftProp] = {
      $gt: this.getLeftValue()
    };
    selector[rightProp] = {
      $lt: this.getRightValue()
    };
  }

  options = {
    sort: {}
  };
  options.sort[leftProp] = 1;

  if (depth) {
    selector[depthProp] = {
      $lte: this.getDepthValue() + depth
    }
  }

  selector[rootProp] = this.getRootValue();


  return Layers.find(selector, options);
};

Node.prototype.getChildren = function(selector) {
  return this.getDescendants(1, false, selector);
};

Node.prototype.getLeftValue = function() {
  return this.getDoc().get(this.getPropertyName('left'));
};

Node.prototype.setLeftValue = function(value) {
  this.getDoc().set(this.getPropertyName('left'), value);
};

Node.prototype.getRightValue = function() {
  return this.getDoc().get(this.getPropertyName('right'));
};

Node.prototype.setRightValue = function(value) {
  this.getDoc().set(this.getPropertyName('right'), value);
};

Node.prototype.getDepthValue = function() {
  return this.getDoc().get(this.getPropertyName('depth'));
};

Node.prototype.setDepthValue = function(value) {
  this.getDoc().set(this.getPropertyName('depth'), value);
};

Node.prototype.getRootValue = function() {
  return this.getDoc().get(this.getPropertyName('root'));
};

Node.prototype.setRootValue = function(value) {
  this.getDoc().set(this.getPropertyName('root'), value);
};

Node.prototype.makeRoot = function(root) {
  this.setLeftValue(1);
  this.setRightValue(2);
  this.setDepthValue(0);
  this.setRootValue(root);

  this.getDoc().save();
};

Node.prototype.addChild = function(doc) {
  doc.getNode().insertAsLastChildOf(this.getDoc());
};

Node.prototype.remove = function() {
  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');

  var root = this.getRootValue();

  var selector = {};
  selector[rootProp] = root;
  selector[leftProp] = {
    $gte: this.getLeftValue()
  };
  selector[rightProp] = {
    $lte: this.getRightValue()
  }
  Layers.find(selector).forEach(function(layer) {
    layer.remove();
  });

  var first = this.getRightValue() + 1;
  var delta = this.getLeftValue() - this.getRightValue() - 1;
  this._shiftLeftRightValues(first, delta, root);
};

Node.prototype.insertAsLastChildOf = function(dest) {
  var left = dest.getNode().getRightValue();
  var right = dest.getNode().getRightValue() + 1;
  var root = dest.getNode().getRootValue();

  this._shiftLeftRightValues(left, 2, root);
  this.setDepthValue(dest.getNode().getDepthValue() + 1);
  this._insertNode(left, right, root);
};

Node.prototype.moveAsLastChildOf = function(dest) {
  var left = this.getDepthValue();
  this.setDepthValue(dest.getNode().getDepthValue() + 1);
  this._updateNode(dest.getNode().getRightValue(), this.getDepthValue() - l);
};

Node.prototype.moveAsPrevSiblingOf = function(dest) {
  if (!dest) {
    return;
  }

  var oldDepth = this.getDepthValue();
  this.setDepthValue(dest.getNode().getDepthValue());
  this._updateNode(dest.getNode().getLeftValue(), this.getDepthValue() - oldDepth);
};

Node.prototype.moveAsNextSiblingOf = function(dest) {
  if (!dest) {
    return;
  }

  var oldDepth = this.getDepthValue();
  this.setDepthValue(dest.getNode().getDepthValue());
  this._updateNode(dest.getNode().getRightValue() + 1, this.getDepthValue() - oldDepth);
};

Node.prototype._updateNode = function(destLeft, depthDiff) {
  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');
  var depthProp = this.getPropertyName('depth');

  var left = this.getLeftValue();
  var right = this.getRightValue();
  var root = this.getRootValue();

  var treeSize = right - left + 1;

  // Make room in the new branch.
  this._shiftLeftRightValues(destLeft, treeSize, root);

  if (left >= destLeft) {
    left += treeSize;
    right += treeSize;
  }

  // Update level for descendants.
  var selector = {};
  var modifier = {};
  var options = {
    multi: true
  };

  selector[rootProp] = root;
  selector[leftProp] = {
    $gt: left
  };
  selector[rightProp] = {
    $lt: right
  };
  modifier.$inc = {};
  modifier.$inc[depthProp] = depthDiff;

  Layers.update(selector, modifier, options);

  // Now there is enough room next to target to move the subtree.
  this._shiftLeftRightRange(left, right, destLeft - left, root);

  // Correct values after source (close gap in old tree).
  this._shiftLeftRightValues(right + 1, -treeSize, root);

  this.getDoc().save();
  this.getDoc().reload();
};

Node.prototype._insertNode = function(left, right, root) {
  this.setLeftValue(left);
  this.setRightValue(right);
  this.setRootValue(root);

  this.getDoc().save();
};

Node.prototype._shiftLeftRightRange = function(first, last, delta, root) {
  var options = {
    multi: true
  };

  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');

  // Update left values.
  var leftSelector = {};
  leftSelector[rootProp] = root;
  leftSelector[leftProp] = {
    $gte: first,
    $lte: last
  };
  var leftModifier = {};
  leftModifier.$inc = {};
  leftModifier.$inc[leftProp] = delta;
  Layers.update(leftSelector, leftModifier, options);

  // Update right values.
  var rightSelector = {};
  rightSelector[rootProp] = root;
  rightSelector[rightProp] = {
    $gte: first,
    $lte: last
  };
  var rightModifier = {};
  rightModifier.$inc = {};
  rightModifier.$inc[rightProp] = delta;
  Layers.update(rightSelector, rightModifier, options);
};

Node.prototype._shiftLeftRightValues = function(first, delta, root) {
  var options = {
    multi: true
  };

  var rootProp = this.getPropertyName('root');
  var leftProp = this.getPropertyName('left');
  var rightProp = this.getPropertyName('right');

  // Update left values.
  var leftSelector = {};
  leftSelector[rootProp] = root;
  leftSelector[leftProp] = {
    $gte: first
  };
  var leftModifier = {};
  leftModifier.$inc = {};
  leftModifier.$inc[leftProp] = delta;
  Layers.update(leftSelector, leftModifier, options);

  // Update right values.
  var rightSelector = {};
  rightSelector[rootProp] = root;
  rightSelector[rightProp] = {
    $gte: first
  };
  var rightModifier = {};
  rightModifier.$inc = {};
  rightModifier.$inc[rightProp] = delta;
  Layers.update(rightSelector, rightModifier, options);
};
