Tinytest.add('Behaviors - Slug', function(test) {
  Slugs = new Mongo.Collection(null);

  var removeAll = function() {
    Slugs.find({}, {
      transform: null
    }).forEach(function(slug) {
      Slugs.remove(slug._id);
    });
  };

  removeAll();

  SlugA = Astro.Class({
    name: 'SlugA',
    collection: Slugs,
    fields: {
      name: 'String'
    },
    behaviors: {
      slug: {}
    }
  });

  var diacritics = 'ąáàâãăåäāǟ' + 'ćĉčçċ' + 'ďđḑ' + 'ęéèêěĕëēė' + 'ģĝğġģ' +
    'ĥħ' + 'íìîĭïīįĩı' + 'ĵ' + 'ķ' + 'łļĺľŀ' + 'ňńņñŉ' + 'óòôŏöōøőȯȱȭõ' +
    'řŗŕ' + 'śŝšş' + 'ťțŧ' + 'úùûūųüűŭũů' + 'ŵ' + 'ŷýÿ' + 'źżž';
  var expected = 'aaaaaaaaaa' + 'ccccc' + 'ddd' + 'eeeeeeeee' + 'ggggg' +
    'hh' + 'iiiiiiiii' + 'j' + 'k' + 'lllll' + 'nnnnn' + 'oooooooooooo' +
    'rrr' + 'ssss' + 'ttt' + 'uuuuuuuuuu' + 'w' + 'yyy' + 'zzz';

  var slugA = new SlugA({
    name: 'Slug ' + diacritics
  });
  slugA.save();
  test.equal(slugA.get('slug'), 'slug-' + expected,
    'The slug function does not work properly'
  );

  var slugA2 = new SlugA({
    name: 'Slug ' + diacritics
  });
  slugA2.save();
  test.equal(slugA2.get('slug'), 'slug-' + expected + '-2',
    'The value of the slag field should be unique'
  );

  slugA.set('name', 'Slug2 ' + diacritics);
  slugA.save();
  test.equal(slugA.get('slug'), 'slug-' + expected,
    'It should not be possible to update a slug'
  );

  removeAll();

  SlugB = Astro.Class({
    name: 'SlugB',
    collection: Slugs,
    fields: {
      title: 'String'
    },
    behaviors: {
      slug: {
        fieldName: 'title',
        slugFieldName: 'slugged',
        canUpdate: true,
        unique: false,
        separator: '_'
      }
    }
  });

  var slugB = new SlugB({
    title: 'Slug ' + diacritics
  });
  slugB.save();
  test.isNotUndefined(slugB.get('slugged'),
    'The name of a field for the slug storage should be "slugged"'
  );
  test.isTrue(_.isString(slugB.get('slugged')),
    'The slug should be created from the value of the "title" field'
  );
  test.isTrue(_.contains(slugB.get('slugged'), '_'),
    'The prefix character should be "_"'
  );

  slugB.set('title', 'Slug2 ' + diacritics);
  slugB.save();
  test.equal(slugB.get('slugged'), 'slug2_' + expected,
    'It should be possible to update a slug"'
  );

  slugB2 = new SlugB({
    title: 'Slug2 ' + diacritics
  });
  slugB2.save();
  test.equal(slugB2.get('slugged'), 'slug2_' + expected,
    'The value of the slag field should not be unique'
  );
});
