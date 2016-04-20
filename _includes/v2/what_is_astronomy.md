# What is Astronomy?

The [Astronomy](https://atmospherejs.com/jagi/astronomy) package introduces the [Model Layer](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for Meteor collections. It can also be named the Object Document Mapping system (ODM) or for people coming from relational database environments the Object-Relational Mapping system (ORM).

Leaving terminology aside, Astronomy gives you a possibility to define a document's schema that includes field definitions, methods, events, validators and many more. As a result, programming is much easier and the amount of code you have to write much smaller. But a picture is worth a thousand words, so let's take a look at a simple example.

**Example**

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
import { class } from 'meteor/jagi:astronomy';

const Posts = new Mongo.Collection('posts');
const Post = Class.create({
  name: 'Post',
  collection: Posts,
  fields: {
    title: {
      type: String,
      validators: [{
        type: 'gte',
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

**Why should I use Astronomy?**

There are many other packages that implement some of the functionalities present in Astronomy. I will try to point out here the main benefits of using Astronomy over other solutions, besides having many features that are listed in the [Features](#features) section.

- Astronomy is highly modularized. This was one of the main principles when creating it. As a result, anyone can easily hook into almost every process that happens in Astronomy. Developers can create their own modules, behaviors and validators.
- It's easy to learn and use. Astronomy does not reinvent the wheel. It takes the best from the tools you are already familiar with, not only from the JavaScript world, but also from other languages.
- When using Astronomy, you can easily replace three to five packages that you already use with a single one that follows the same pattern across all its modules. The main principle is simplicity.
- It follows quite different principles to do the job than other packages do. As a result, the amount of code you have to write to setup your classes and create application logic is significantly lower.
- There are many developers and companies that are already using Astronomy in production.

Here are some comments from developers using Astronomy:

> If this package were around when I created SimpleSchema, I would have used it instead of creating SimpleSchema.

[Eric Dobbertin, author of SimpleSchema](https://github.com/jagi/meteor-astronomy/issues/27#issuecomment-110996499)

> I love your package, it's really great [...] as RoR developer, this package is really exciting!

[rsignavong](https://gitter.im/jagi/meteor-astronomy/archives/2015/05/22)

> Anyway, very happy to have moved to astronomy, really like it we will release an app using it soon, so I will let you know.

[banglashi](https://gitter.im/jagi/meteor-astronomy/archives/2015/05/20)

> I still don't understand how this package is not getting more popular imho this package is better than simple-schema.

[dstollie](https://crater.io/comments/CQTsP4SNabfquv4ds)

> Amazing work, beautifully designed package! Anyone give this package few seconds and take a look at sources? If people will write code in such clean and modular way, world would be better! Kudos Jagi!

[Kuba Wyrobek](https://crater.io/comments/BY9Qn9f4DKHFFuBp5)

> Amazing package indeed! Coming from a php MVC background, this package is a gift :). You rock!

[roelvan](https://github.com/jagi/meteor-astronomy/issues/1#issuecomment-91836156)

> Thanks - this has the makings of an amazing tool.... I'm hoping to replace Mesosphere, collection-hooks, collection-helpers, and a bunch of custom code - all with a cleaner code base!

[dovrosenberg](https://github.com/jagi/meteor-astronomy/issues/11#issuecomment-107089733)

**History**

The idea for creating a package for Meteor that would introduce a Model Layer emerged after creating several simple Meteor applications. I noticed that I was constantly repeating the same parts of a code to manage documents' storage and validation. It was frustrating in comparison to what I've been accustomed to in the [Doctrine](http://www.doctrine-project.org/) library for [PHP](https://php.net/) that I had used for many years.

This is why I've decided to create a Meteor package that would take the best from the Doctrine library. The first version was released in 2013 and was named [Verin Model](https://github.com/jagi/verin-model). It worked well in my projects, so I made it available to the community through the [Meteorite](https://github.com/oortcloud/meteorite/) package installer. However, I haven't been promoting it anywhere so the number of users was limited.

In the late 2014, I decided to give it one more try and implement a much better package. A package that would be modular, would have all the features from the previous package and a few more additions. In the meanwhile, many developers tried to fill a gap of lack of model layer in Meteor with their packages. Some of them (e.g. [SimpleSchema](https://atmospherejs.com/aldeed/simple-schema)) had features that I was looking for, but were too complex to use. Some packages just focused on single features ([Collection Hooks](https://atmospherejs.com/matb33/collection-hooks), [Collection Behaviours](https://atmospherejs.com/sewdn/collection-behaviours), [Collection Helpers](https://atmospherejs.com/dburles/collection-helpers)). I didn't like the idea of using many packages that followed quite different rules. I just wanted one modular tool that would fit all my needs. That's why I've created Astronomy.

**Why the name "Astronomy"?**

As almost everything that is Meteor-related has some space-related name, this one couldn't be an exception. The model layer in the MVC pattern is a description of real objects. And, the science describing objects in space is called [Astronomy](http://en.wikipedia.org/wiki/Astronomy). The choice was quick.