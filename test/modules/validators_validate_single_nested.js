Tinytest.add( 'Validators - validate nested field', function ( test ) {
    // Reset Astronomy.
    reset();

    var ValidatorCollection = new Mongo.Collection( null );
    var v = Validators;

    var ValidatorItem = Astro.Class( {
        name: 'ValidatorItem',
        collection: ValidatorCollection,
        fields: {
            'object'            : { type: 'object', validator: v.object() },
            'object.nestedField': { type: 'string', validator: [v.string()] }
        }
    } );

    var validatorItem = new ValidatorItem();


    // NOT PASSING VALIDATION

    validatorItem.set( 'object', { nestedField: 2 } );

    test.isFalse( validatorItem.validate( ),
        'Validation of a nested field should not pass. '
    );
} );
