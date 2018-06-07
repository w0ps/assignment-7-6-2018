const request = require( 'request' );
const async = require( 'async' );
var config = require( './config' );
var rateLimiterFactory = require( './rateLimiter' );

type actor = {
	id: number,
	name: string,
	birthday: string
}

type show = {
	id: number;
	name: string;
	cast: actor[];
}

type scraper = {
	progress: string;
	shows: show[];
};

var scraper: scraper = {
	progress: '0',
	shows: []
};

module.exports = scraper;

request( { url: config.apiUrl + config.apiEntry, json: true }, function iteratee( error, response, body ) {
	const ids = body.map( show => show.id );

	console.log('scraper starting to get ' + ids.length + ' shows' )

	const rateLimitedFun = rateLimiterFactory( config.rateWindow, config.rateLimit );

	async.eachSeries( ids, function getShow( id, cb ) {

		rateLimitedFun( function getShow( cb ) {

			return request( { url: config.apiUrl + 'shows/' + id + '?embed=cast', json: true }, handleShowResponse );

			function handleShowResponse( error, response, body ) {
				if( error ) return cb( error );

				scraper.shows.push( {
					id: body.id,
					name: body.name,
					cast: body._embedded.cast.map( castMember => ( {
						id: castMember.person.id,
						birthday: castMember.person.birthday,
						name: castMember.person.name
					} ) ).sort( ( a, b ) => new Date( a.birthday ).getTime() - new Date( b.birthday ).getTime() )
				} );

				scraper.progress = scraper.shows.length + ' / ' + ids.length;

				cb();
			}
		}, cb );
	},
	function done( error ) {
		if( error ) {
			console.error( error );
			process.exit();
		}

		console.log('scraping finished');
	} );
} );
