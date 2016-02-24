import castNested from '../../fields/utils/cast_nested.js';

function applyModifier({
	doc,
	modifier,
	options
}) {
	// Use Minimongo "_modify" method to apply modifier.
	LocalCollection._modify(doc, modifier, options);

	// Cast values that was set using modifier.
	castNested(doc);
};

export default applyModifier;