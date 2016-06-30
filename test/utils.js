import _ from 'lodash';
import { Class, Behavior } from 'meteor/jagi:astronomy';

resetDatabase = function() {
	_.forOwn(Class.classes, function(Class) {
		let Collection = Class.getCollection();
		if (!Collection) {
			return;
		}

		// Remove documents from the collection.
		Collection.find().forEach(function(doc) {
			Collection.remove(doc._id);
		});
	});
};

resetMethods = function() {
  _.forOwn(Class.classes, function(Class) {
		let Collection = Class.getCollection();
		if (!Collection) {
			return;
		}

		let methodHandlers;
		if (Meteor.connection) {
			methodHandlers = Meteor.connection._methodHandlers;
		}
		else if (Meteor.server) {
			methodHandlers = Meteor.server.method_handlers;
		}
		if (!methodHandlers) {
			return;
		}

		delete methodHandlers['/' + Collection._name + '/insert'];
		delete methodHandlers['/' + Collection._name + '/update'];
		delete methodHandlers['/' + Collection._name + '/remove'];
	});
};

reset = function() {
	resetDatabase();
	resetMethods();

	Class.classes = {};
	Behavior.behaviors = {};
};