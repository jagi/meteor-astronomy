# Troubleshooting

There are several warnings that can be printed in the console that you may think are unnecessary. Nothing like that, there is always a reason behind any warning. You're probably doing something wrong.

Probably the most common warning is `Trying to set a value of the "field" field that does not exist in the "Class" class'`. The warning is caused by trying to set a field that is not defined in the class schema. You were probably playing with a class schema and inserted some values into database that you are not using anymore. In that situation you should clean your collection from unnecessary fields.

If you are right that everything is correct and you still receives warnings, then you can turn off them at all.

```js
Astro.config.verbose = false;
```