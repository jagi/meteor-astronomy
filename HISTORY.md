# [2.7.1](/releases/tag/2.7.1) (2019-01-05)
- Fix #671 by introducing several logging flags:
```js
import { config } from "meteor/jagi:astronomy";

config.logs.deprecation = false; // Turn off deprecation warnings.
config.logs.nonExistingField = false; // Turn off warnings about non existing fields.
config.logs.classDuplicate = false; // Turn off class duplication warnings.
config.logs.typeDuplicate = false; // Turn off type duplication warnings.
```

# [2.7.0](/releases/tag/2.7.0) (2018-12-27)
- Fix issue #694
You can limit list of modified fields from the `getModified` and `getModifiedValues` methods to only include fields that will actually be saved using the `save({ fields: [/* list of fields */] })` option.
```js
beforeSave(e) {
  const doc = e.target;
  console.log(doc.getModified({ fields: e.fields }));
  console.log(doc.getModifiedValues({ fields: e.fields }));
}
```

# [2.6.3](/releases/tag/2.6.3) (2018-10-19)
- Workaround for the issue #694. From now all the storage operation options are being passed to the event object. For example when calling the `save` method:
```js
user.save({ fields: ["firstName"] });
```
The fields option will be available in the event handler.
```js
events: {
  beforeSave(e) {
    if (
      e.fields &&
      e.fields.includes("firstName") &&
      e.currentTarget.isModified("firstName")
    ) {
      // Do something...
    }
  }
}
```

# [2.6.2](/releases/tag/2.6.2) (2018-10-19)
- Revert to previous behavior before fix #689

# [2.6.1](/releases/tag/2.6.1) (2018-10-18)
- Fix #689

# [2.6.0](/releases/tag/2.6.0) (2018-09-19)

# [2.5.8](/releases/tag/2.5.8) (2018-05-29)
- Warn about type and class duplicates

# [2.5.7](/releases/tag/2.5.7) (2018-04-11)
- the `getValues` method for the `Enum` types #669

# [2.5.6](/releases/tag/2.5.6) (2018-02-16)
- Pass error to the callback function (if provided) on an error in the `/Astronomy/execute` method

# [2.5.5](/releases/tag/2.5.5) (2018-02-15)
- Set `throwStubExceptions` to `true` for the `/Astronomy/execute` method

# [2.5.4](/releases/tag/2.5.4) (2018-02-15)
- Create Meteor methods for local collections

# [2.5.3](/releases/tag/2.5.3) (2018-01-29)
- Fix #652

# [2.5.2](/releases/tag/2.5.2) (2017-10-06)
- Add the `forceUpdate` option to the `save` method #568

# [2.5.1](/releases/tag/2.5.1) (2017-09-21)
- Fix #645 use the `_createUpsertDocument` function when `_removeDollarOporators` is missing

# [2.5.0](/releases/tag/2.5.0) (2017-09-12)
- Do not support Meteor versions lower than 1.3 #642
- Fix problem with saving arrays of undefineds / nulls #644

# [2.4.8](/releases/tag/2.4.8) (2017-07-08)
- Provide a fallback for not finding a document with an ID when calling Meteor method #630

# [2.4.7](/releases/tag/2.4.7) (2017-07-01)
- Fix #627

# [2.4.6](/releases/tag/2.4.6) (2017-06-29)
- Fix #625 and add Enum type tests

# [2.4.5](/releases/tag/2.4.5) (2017-06-24)
- Decrease bundle size by limiting usage of lodash and rewriting imports to not include entire lodash but only functions that are used #622

# [2.4.4](/releases/tag/2.4.4) (2017-06-24)
- Speed up multiple updates
- Add index for the `type` property

# [2.4.3](/releases/tag/2.4.3) (2017-04-05)
- Allow overriding the "type" property in selector for inherited classes #602

# [2.4.2](/releases/tag/2.4.2) (2017-03-22)
- Pass meteor methods down the inheritance tree #596
- Allow casting array elements for embedded field names
```js
const user = new User();
// Now casting works also for array elements
user.set('phones.0', '123456789', {
  cast: true
});
```

# [2.4.1](/releases/tag/2.4.1) (2017-03-12)
- Fix bug with lack of the Enum.js file

# [2.4.0](/releases/tag/2.4.0) (2017-02-21)
- Union type

``` js
import { Class, Union } from 'meteor/jagi:astronomy';

const StringOrNumber = Union.create({
  name: 'StringOrNumber',
  types: [String, Number],
  cast(value) {
    if (typeof value !== 'string') {
      return String(value);
    }
    return value;
  }
});

const Item = Class.create({
  name: 'Item',
  fields: {
    strOrNum: StringOrNumber
  }
});
```

# [2.3.13](/releases/tag/2.3.13) (2017-02-14)
- Fix email validation so that it accepts all allowed characters
- Option to validate only modified fields

``` js
user.firstName = 'John';
user.validate({
  modified: true
});
```
- Do not set default values on fetch if the `Astro.config.defaults` flag is set to `false`

``` js
Astro.config.defaults = false;
User.findOne(); // Default values won't be set
```

# [2.3.12](/releases/tag/2.3.12) (2017-01-12)
- Fix console.warn error in MS Edge
- Add missing lodash import

# [2.3.11](/releases/tag/2.3.11) (2016-12-20)
- Fix #570 by not adding the `_isNew` property to classes without collection attached

# [2.3.10](/releases/tag/2.3.10) (2016-12-16)
- Fix #564 a bug with not catching meteor method errors thrown on the client
- Fix #551 by adding modules' aliases
- Fix #560 and undeprecate `_isNew` also fixing the `_isNew` property in the `beforeInit` event

# [2.3.9](/releases/tag/2.3.9) (2016-12-03)
- Temporary fix #556 for detecting $inc and $push modifiers on document update

# [2.3.8](/releases/tag/2.3.8) (2016-12-01)
- Fix #557 not retrieving multiple raw values of nested fields

# [2.3.7](/releases/tag/2.3.7) (2016-11-26)
- Fix #546 wrong merging of Date fields

# [2.3.6](/releases/tag/2.3.6) (2016-11-22)
- Fix #538 - cast default values

# [2.3.5](/releases/tag/2.3.5) (2016-11-21)
- Fix #541 deprecation warning during inheritance

# [2.3.4](/releases/tag/2.3.4) (2016-11-17)
- #537 Improve casting empty string for required and optional fields

``` js
// Required fields:
item.set('number', '', {cast: true}); // Casts to 0
item.set('boolean', '', {cast: true}); // Casts to false
item.set('date', '', {cast: true}); // Does not cast
item.set('object', '', {cast: true}); // Does not cast
item.set('list', '', {cast: true}); // Does not cast
// Optional fields:
item.set('number', '', {cast: true}); // Casts to null
item.set('boolean', '', {cast: true}); // Casts to null
item.set('date', '', {cast: true}); // Casts to null
item.set('object', '', {cast: true}); // Casts to null
item.set('list', '', {cast: true}); // Casts to null
```
- #482 Deprecate using `doc._isNew` and introduce a new `Class.isNew` method and fix a bug with wrong value of the `doc._isNew` property in the `afterInit` event

``` js
const Item = Class.create({
  name: 'Item',
  collection: new Mongo.Collection('items'),
  events: {
    afterInsert(e) {
      const doc = e.target;
      Item.isNew(doc);
    }
  }
});
```
- #478 Allow options (transient, immutable, undefined) as the last argument of the `raw()` method.
- Allow options (transient, immutable, undefined) as the last argument of the `get()` method.
- #536 Extend child classes when extending parent class
- #475 Pass full path name in validation error object for double nested documents
- Small bug fixes and code cleaning

# [2.3.3](/releases/tag/2.3.3) (2016-11-13)
- Fix #534 a bug when non object values were unnecessary resolved

# [2.3.2](/releases/tag/2.3.2) (2016-11-10)
- Fix resolving values bug when using the "fields" options

# [2.3.1](/releases/tag/2.3.1) (2016-11-10)
- Fix a bug causing the `softremove` behavior not to work with version >=2.2.4

# [2.3.0](/releases/tag/2.3.0) (2016-11-08)
- [Casting values](http://jagi.github.io/meteor-astronomy/v2#casting-values)

``` js
user.set({
  firstName: 123 // Will be casted to the "123" string
}, {
  cast: true
});
```
- [Casting values on save](http://jagi.github.io/meteor-astronomy/v2#storing-documents)

``` js
const user = new User(userFormData);
user.save({
  cast: true
});
```
- [Casting on validation](http://jagi.github.io/meteor-astronomy/v2#validation)

``` js
const user = new User(userFormData);
user.validate({
  cast: true
});
```
- [Allow merging values on set instead of overriding](http://jagi.github.io/meteor-astronomy/v2#setting-and-getting-values)

``` js
const addressData = {
  state: 'CA'
};
// Will not override the "city" property in address.
user.set('address', addressData, {
  merge: true
});
```
- Allow turning off default values in the `find()` method

``` js
const users = User.find(selector, {
  defaults: false
}).fetch();
```
- Allow turning off the resolve feature for performance improvements

``` js
Astro.config.resolving = false;
```

# [2.2.4](/releases/tag/2.2.4) (2016-10-28)
- Add Meteor methods' checks for the `audit-argument-checks` package

# [2.2.3](/releases/tag/2.2.3) (2016-10-28)
- Fix #526 problem with not allowing executing Meteor methods on new document

# [2.2.2](/releases/tag/2.2.2) (2016-10-27)
- Fix #525 security issue allowing to override invocation context

# [2.2.1](/releases/tag/2.2.1) (2016-10-27)
- Fix not returning value from deprecated functions (`getMethods`, `getMethod`, `hasMethod`) in the methods module

# [2.2.0](/releases/tag/2.2.0) (2016-10-26)
- New class property `meteorMethods` for defining Meteor methods that will be executed on the client and server like regular Meteor methods.

``` js
const User = Class.create({
  name: User,
  collection: Users,
  fields: {
    firstName: String,
    lastName: String
  },
  meteorMethods: {
    rename(first, last, invocation) {
      // invocation.isSimulation;
      // invocation.unblock();
      this.firstName = first;
      this.lastName = last;
      this.save();
    }
  }
});
const u = User.findOne();
// Possible ways of invocations.
u.rename('John', 'Smith', (err, result) => {
});
u.callMethod('rename', 'John', 'Smith', (err, result) => {
});
u.applyMethod('rename', ['John', 'Smith'], (err, result) => {
});
```

You can read more about Meteor methods in [docs](http://jagi.github.io/meteor-astronomy/v2#meteor-methods--220)
- `methods` have been renamed to `helpers`. You can still use the `methods` property but it's deprecated and will be removed in the future Astronomy releases.

# [2.1.5](/releases/tag/2.1.5) (2016-10-14)
- Fix the `getChildren` class method to get children on all depths

``` js
Parent.find(selector, {
  children: true // Get children, grand children and so on
});
Parent.find(selector, {
  children: 1 // Get only direct children
});
Parent.find(selector, {
  children: 2 // Get children and grand children
});
Parent.getChildren(/* default true */);
```
- Add methods' checks for the `audit-argument-checks` package
- Fix #513 infinite check loop of nested class for index definitions

# [2.1.4](/releases/tag/2.1.4) (2016-09-30)
- Fix #505 not casting nested fields before insert and update events

# [2.1.3](/releases/tag/2.1.3) (2016-09-28)
New features:
- Class level validation - having the `Post` class you can now validate by calling `Post.validate(rawData)` or `Post.validateAll(rawData)`
- Ability to get check pattern -  - having the `Post` class you can call `const pattern = Post.getCheckPattern()` to get pattern and use it in the check `check(doc, pattern)`

Fixes:
- Fix #445 IE11 error with Number constructor
- Fix not cloning options passed to the `find()` method

# [2.1.2](/releases/tag/2.1.2) (2016-08-05)
- Fix problem with incorrect values resolving in child classes
- Add information about class name in `ValidationError` and `resolveError` method

# [2.1.1](/releases/tag/2.1.1) (2016-07-26)
- Consistent ID generation on client and server (works with the `validated-method` package)
- Allow non ID selectors on the client when in simulation
- Support nested indexes
- By default clone class constructor argument and values being set using the `set()` method. Right now, if you don't want to clone by default, you can do so with the following code `new Post(args, {clone: false})` and `post.set(args, {clone: false})`.

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
