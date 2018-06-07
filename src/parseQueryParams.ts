function parseQueryParams( url ) {
	var paramRegex = /[\?|\&]([a-z]+)=([0-9]+)/g,
			matches = [],
			match;

	while( match = paramRegex.exec( url ) ) matches.push( match );

	return matches.reduce( ( memo, match ) => {
		memo[ match[ 1 ] ] = match[ 2 ];
		return memo;
	}, {} );
}

module.exports = parseQueryParams;
