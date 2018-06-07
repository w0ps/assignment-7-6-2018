var config = require( './config' );

var scraper: scraper = require( './scraper' );
var parseParams = require( './parseQueryParams' );
const http = require( 'http' );

const startup = new Date();

var server = http.createServer( function handleRequest( req, res ) {
	if( /^\/$/.exec( req.url ) ) {
		return renderIndex( res );
	} else if( /^\/shows/.exec( req.url ) ) {
		return renderList( res, parseParams( req.url ) );
	}

	res.end();
} );

server.listen( config.portNumber );

function renderIndex( res ) {
	res.writeHead( 200, { 'Content-Type': 'application/json' } );

	res.write( JSON.stringify( { status: 'online since ' + startup.toISOString(), progress: scraper.progress } ) );
	res.end();
}

function renderList( res, params ) {
	const { size, page } = params;

	res.writeHead( 200, { 'Content-Type': 'application/json' } );

	const start = ( +size || 0 ) * ( page - 1 || 0 );
	const end = start + +size;

	res.write( JSON.stringify( scraper.shows.slice( start, end ) ) );
	res.end();
}
