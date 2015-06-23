typesOnInitModule = function() {
  Astro.createType({
    name: 'string',
    cast: function(value) {
      return String(value);
    }
  });

  Astro.createType({
    name: 'number',
    cast: function(value) {
      return Number(value);
    }
  });

  Astro.createType({
    name: 'boolean',
    cast: function(value) {
      return Boolean(value);
    }
  });

  Astro.createType({
    name: 'object',
    cast: function(value) {
      return new value.constructor(value);
    }
  });

  Astro.createType({
    name: 'array',
    cast: function(value) {
      if (_.isArray(value)) {
        return value;
      }

      return [value];
    }
  });

  Astro.createType({
    name: 'date',
    cast: function(value) {
      if (_.isString(value)) {
        var date = Date.parse(value);
        if (!_.isNaN(date)) {
          return new Date(date);
        } else {
          return null;
        }
      } else if (_.isNumber(value)) {
        return new Date(value);
      } else {
        return value;
      }
    }
  });

  _.extend(Astro.BaseClass.prototype, {
    getDisplay: function(fieldNameOrPattern, params) {
      var doc = this;
      var Class = doc.constructor;
      var retval;

      if (arguments.length === 0) {
        return doc.getDisplay(Astro.utils.fields.getAllFieldsNames(Class));
      } else if (arguments.length === 1) {
         if (_.isArray(fieldNameOrPattern)) {
           retval = {};

           _.each(fieldNameOrPattern, function(name) {
             values[name] = doc.getDisplay(name);
           });
           return retval;
         } else if (_.isString(fieldNameOrPattern)) {
           if (fieldNameOrPattern.indexOf('$') === -1) {
             var fieldDefinition = Astro.utils.fields.getDefinition(Class, fieldNameOrPattern);
             var value = doc.get(fieldNameOrPattern);

             if (fieldDefinition) {
               return Astro.utils.types.displayValue(fieldDefinition.type, value, params);
             } else {
               return value;
             }
           } else {
             var fieldNames = Astro.utils.fields.getFieldsNamesFromPattern(
               doc,
               fieldNameOrPattern
             );
             retval = {};

             _.each(names, function(name) {
               values[name] = doc.getDisplay(name);
             });
             return retval;
           }
         }
       }
     }
  });
};
