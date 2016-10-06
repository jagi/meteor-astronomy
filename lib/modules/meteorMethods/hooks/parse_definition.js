import _ from 'lodash';
import throwParseError from '../../core/utils/throw_parse_error.js';
import reservedKeywords from '../../../core/reserved_keywords.js';
import wrapMethodInMeteor from '../meteor_methods/wrapper.js';

function onParseDefinition(parsedDefinition, definition, className) {
    // Check existence and validity of the "meteorMethods" property.
    if (definition.meteorMethods !== undefined) {
        if (!Match.test(definition.meteorMethods, Object)) {
            throwParseError([{
                'class': className
            }, {
                'property': 'meteorMethods'
            },
                'meteorMethods definition has to be an object'
            ]);
        }

        _.each(definition.meteorMethods, function (meteorMethod, meteorMethodName) {
            if (!Match.test(meteorMethod, Function)) {
                throwParseError([{
                    'class': className
                }, {
                    'meteorMethod': meteorMethodName
                },
                    'meteorMethod has to be a function'
                ]);
            }

            if (_.includes(reservedKeywords, meteorMethodName)) {
                throwParseError([{
                    'class': className
                }, {
                    'meteorMethod': meteorMethodName
                },
                    'Reserved keyword'
                ]);
            }

            parsedDefinition.meteorMethods[meteorMethodName] = wrapMethodInMeteor(className, meteorMethodName, meteorMethod);
        });
    }
};

export default onParseDefinition;