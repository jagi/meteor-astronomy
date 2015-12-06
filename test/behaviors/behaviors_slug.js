Tinytest.add('Behaviors - Slug', function(test) {
  // Reset Astro.
  reset();

  var SlugsA = new Mongo.Collection(null);
  var SlugsB = new Mongo.Collection(null);

  SlugsA.find({}, {
    transform: null
  }).forEach(function(slug) {
    SlugsA.remove(slug._id);
  });

  SlugsB.find({}, {
    transform: null
  }).forEach(function(slug) {
    SlugsB.remove(slug._id);
  });

  var SlugA = Astro.Class.create({
    name: 'SlugA',
    collection: SlugsA,
    fields: {
      name: 'string'
    },
    behaviors: {
      slug: {}
    }
  });

  var SlugB = Astro.Class.create({
    name: 'SlugB',
    collection: SlugsB,
    fields: {
      title: 'string'
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

  var diacritics = 'ąáàâãăåäāǟ' + 'ćĉčçċ' + 'ďđḑ' + 'ęéèêěĕëēė' + 'ģĝğġģ' +
    'ĥħ' + 'íìîĭïīįĩı' + 'ĵ' + 'ķ' + 'łļĺľŀ' + 'ňńņñŉ' + 'óòôŏöōøőȯȱȭõ' +
    'řŗŕ' + 'śŝšş' + 'ťțŧ' + 'úùûūųüűŭũů' + 'ŵ' + 'ŷýÿ' + 'źżž' +
    'абчдеёэфгийяъюкхлмнопрсшщтцувызж';
  var expected = 'aaaaaaaaaa' + 'ccccc' + 'ddd' + 'eeeeeeeee' + 'ggggg' +
    'hh' + 'iiiiiiiii' + 'j' + 'k' + 'lllll' + 'nnnnn' + 'oooooooooooo' +
    'rrr' + 'ssss' + 'ttt' + 'uuuuuuuuuu' + 'w' + 'yyy' + 'zzz' +
    'abchdeeefgiiiaieiukkhlmnoprsshshchttsuvyzzh';

  var slugA1 = new SlugA();
  slugA1.set('name', 'Slug ' + diacritics);
  slugA1.save();
  test.equal(slugA1.get('slug'), 'slug-' + expected,
    'The slug function does not work properly'
  );

  var slugA2 = new SlugA();
  slugA2.set('name', 'Slug ' + diacritics);
  slugA2.save();
  test.equal(slugA2.get('slug'), 'slug-' + expected + '-2',
    'The value of the slag field should be unique'
  );

  slugA1.set('name', 'Slug2 ' + diacritics);
  slugA1.save();
  test.equal(slugA1.get('slug'), 'slug-' + expected,
    'It should not be possible to update a slug'
  );

  var slugB1 = new SlugB();
  slugB1.set('title', 'Slug ' + diacritics);
  slugB1.save();
  test.isNotUndefined(slugB1.get('slugged'),
    'The name of a field for the slug storage should be "slugged"'
  );
  test.isTrue(_.isString(slugB1.get('slugged')),
    'The slug should be created from the value of the "title" field'
  );
  test.isTrue(_.contains(slugB1.get('slugged'), '_'),
    'The prefix character should be "_"'
  );

  slugB1.set('title', 'Slug2 ' + diacritics);
  slugB1.save();
  test.equal(slugB1.get('slugged'), 'slug2_' + expected,
    'It should be possible to update a slug"'
  );

  slugB2 = new SlugB();
  slugB2.set('title', 'Slug2 ' + diacritics);
  slugB2.save();
  test.equal(slugB2.get('slugged'), 'slug2_' + expected,
    'The value of the slag field should not be unique'
  );
});
