# Astronomy for Meteor

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

<img src="http://jagi.github.io/meteor-astronomy/images/logo.png" />

The [Astronomy](https://atmospherejs.com/jagi/astronomy) package introduces the [Model Layer](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) into Meteor applications. It can also be named the Object Document Mapping system (ODM) or for people coming from relational database environments the Object-Relational Mapping system (ORM). Astronomy extends MongoDB documents with functionalities defined in a schema.

## Documentation

Astronomy documentation can be found [here](http://jagi.github.io/meteor-astronomy/).

## Tutorials

You can learn more about Astronomy by watching video tutorials that I'm creating. I'm trying to add a new one every week. You can access them here https://goo.gl/9gnrav

## Installation

```sh
$ meteor add jagi:astronomy
```

## Support Astronomy development

[<img src="https://www.patreon.com/images/patreon_navigation_logo_mini_orange.png" width="100" />](https://www.patreon.com/jagi)

I've decided to start [Patreon](https://www.patreon.com/jagi) page. If you enjoy using Astronomy and want to support development of future versions, then any donation will be welcome :).

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

With Astronomy and defined schema your code would look like follows:
```js
// Notice that we call the "findOne" method
// from the "Post" class not from the "Posts" collection.
var post = Post.findOne(id);
// Auto convert a string input value to a number.
post.title = tmpl.find('input[name=title]').value;
post.publishedAt = new Date(tmpl.find('input[name=publishedAt]').value);
// Check if all fields are valid and update document
// with only the fields that have changed.
post.save();
```

What approach is simpler? I think the choice is obvious.

For clarity, here is a sample schema that allows that. May seem to be a lot of
code but have in mind that you write it only once.

```js
import { Class } from 'meteor/jagi:astronomy';

const Posts = new Mongo.Collection('posts');
const Post = Class.create({
  name: 'Post',
  collection: Posts,
  fields: {
    title: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 3
      }]
    },
    userId: String,
    publishedAt: Date
  },
  behaviors: {
    timestamp: {}
  }
});
```

## Supporters

[<img src="http://jagi.github.io/meteor-astronomy/images/usefulio.png" />](http://useful.io/)

## Contribution

Bigs thanks for all the [contributions](https://github.com/jagi/meteor-astronomy/graphs/contributors) in form of commits and bug reports. Without you it would not be possible to improve Astronomy. Special thanks to:
- [Faberle](https://github.com/Faberle) - for help with Meteor methods feature
- [Ben305](https://github.com/Ben305) - for several PRs
- [peterchoo](https://github.com/peterchoo) - for several PRs
- [talha-asad](https://github.com/talha-asad) - for updating History of changes
- all other commiters that I forgot to mention

If you have any suggestions or want to write new features or behaviors please contact me, or just create an issue or a pull request. If you found any error please create a reproduction repository and create an issue. Thanks to that it will be easier for me to tell what is wrong. Please, don't use CoffeeScript for creating a reproduction.

## License

Astronomy is released under the [MIT License](http://opensource.org/licenses/MIT).
