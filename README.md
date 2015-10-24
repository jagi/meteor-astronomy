# Astronomy for Meteor

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

<img src="http://astronomy.jagi.io/logo.png" />

The [Astronomy](https://atmospherejs.com/jagi/astronomy) package introduces the [Model Layer](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for Meteor collections. It can also be named the Object Document Mapping system (ODM) or for people coming from relational database environments the Object-Relational Mapping system (ORM). Astronomy extends MongoDB documents with functionalities defined in a schema.

## Documentation

Astronomy documentation can be found [here](http://astronomy.jagi.io).

## Installation

```sh
$ meteor add jagi:astronomy
```

## Moving to 1.0.0

If your working project is using Astronomy in version 0.12.1 then it's recommended to move to version 1.0.0. You can find information about changes in 1.0.0 in the [HISTORY.md](https://github.com/jagi/meteor-astronomy/blob/master/HISTORY.md) file. However, if you are not able to upgrade your project, you have to specify Astronomy version you want to use.

```js
meteor add jagi:astronomy@0.12.1
```

Support for the 0.12.1 version will not be continued.

## Introduction

When fetching documents from Mongo collections, you get plain JavaScript objects without any logic. You have to validate values of objects' properties, check what fields have changed, save only modified fields, transform values coming from forms, in every place you are playing with a document; a lot of things to do. Wouldn't it be great if you could define some simple rules and leave everything else to framework? It's actually possible thanks to Astronomy. But first let's take a look at how your code would look like without using Astronomy.

```js
var post = Posts.findOne(id);
// Assign values manually instead doing it automatically.
post.createdAt = new Date();
post.userId = Meteor.userId();
// Manually convert values coming from the form.
post.title = tmpl.find('input[name=title]').value;
post.publishedAt = new Date(tmpl.find('input[name=publishedAt]').value);
// Every time implement custom validation logic.
if (post.title.length < 3) {
  // Implement an error messages system.
  throw new Error('The "title" field has to be at least 3 characters long');
} else {
  // Detect what fields have changed and update only those.
  // Access collection directly.
  Posts.update({
    _id: post._id
  }, {
    $set: {
      title: post.title,
      publishedAt: post.publishedAt,
      createdAt: post.updateAt
    }
  });
}
```

With Astronomy and a defined schema your code would look like follows:

```js
var post = Posts.findOne(id);
// Auto convert a string input value to a number.
post.set('title', tmpl.find('input[name=title]').value);
post.set('publishedAt', tmpl.find('input[name=publishedAt]').value);
// Check if all fields are valid.
if (post.validate()) {
  // Update document with with only the fields that have changed.
  post.save();
}
```

What approach is simpler? I think the choice is obvious.

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create an issue or a pull request. If you found any error please create a reproduction repository and create an issue. Thanks to that it will be easier for me to tell what is wrong. Please, don't use CoffeeScript for creating a reproduction.

## License

Astronomy is released under the [MIT License](http://opensource.org/licenses/MIT).
