# [2.1.0](/releases/tag/2.1.0) (2016-06-30)
BREAKING CHANGES!
- Classes are secured by default
- The children option set to true by default in the Class.find() method

NEW FEATURES!
- Resolve optional field using function
- Support for child classes in Class.update() and Class.remove() methods
- Inheritance for non stored classes
- Allow changing collection and typeField properties in child classes
- The integer validator
... and bug fixes

# [2.0.1](/releases/tag/2.0.1) (2016-05-03)
- Pass validator name to the resolveError method

# [2.0.0](/releases/tag/2.0.0) (2016-05-01)
[Upgrade guide](http://jagi.github.io/meteor-astronomy/#upgrading-to-20) for v1 users.

NEW FEATURES!
- ES2015 compatible
- Direct collection/class access (support for all MiniMongo modifiers)
- New events system
- Improved [events propagation](http://jagi.github.io/meteor-astronomy/#events-propagation) for nested classes
- Better error reporting on invalid schema
- New [modules](http://jagi.github.io/meteor-astronomy/#writing-modules) system
- Automatic document modifications detection. Now you can modify your documents freely without using `set`, `push`, `inc` etc. methods. Astronomy will detect changes to your documents and try to perform minimal query
- Save and remove methods implemented as Meteor methods. No need to create your own Meteor method to perform operation in both environments (client & server) - just call `doc.save()` or `doc.remove()`
- Validate document on every save
- Support for ObjectIDs
- GraphQL ready (support for GraphQL in future Meteor releases)
- New validators system
- Add multiple behaviors of the same type to the one class
- Mapping field name to different field name in collection
- [ENUM](http://jagi.github.io/meteor-astronomy/#enum-type) type