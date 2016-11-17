# Casting values

In the [Setting and getting values](#setting-and-getting-values) section will described how to cast values being set in a document. Each field type comes with its own default casting function. Here are examples of how given values will be casted using default casting functions.

```
String
123 => "123"
true => "true"
false => "false"
{foo: "bar"} => {foo: "bar"}
```

```
Number
"123" => 123
true => 1
false => 0
{foo: "bar"} => {foo: "bar"}
```

```
Date
572137200000 => Date(1988, 1, 18)
"1988-02-18" => Date(1988, 1, 18)
"2/18/1988" => Date(1988, 1, 18)
true => true
false => false
{foo: "bar"} => {foo: "bar"}
```

```
Boolean
0 => false
1 => true
"false" => false
"FALSE" => false
"0" => false
"TRUE" => true
"abc" => true
{foo: "bar"} => {foo: "bar"}
```

As you can see, objects are not casted and only plain values goes through the casting function. There are also several nice tricks for easier casting of values coming from the forms, like the `"FALSE"` string will be casted to the `false` value.

We also need to discuss how empty strings (`""`) are casted to each type depending on whether a field is optional or required.

```js
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

In most cases default casting functions will fit your needs, however there are situations when you would like to define custom casting function. Astronomy 2.3 allows defining custom casting functions. Let's take a look at the example.

```js
const pattern = {
  year: Number,
  month: Number,
  day: Number
};
const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    birthDate: {
      type: Date,
      cast(value) {
        if (Match.test(value, pattern)) {
          return new Date(
            value.year,
            value.month,
            value.day
          );
        }
        return value;
      }
    }
  }
});
```

In this example, when you try assigning an object with the "year", "month", "day" properties being numbers, the casting function will cast such an object into a date object.
