function rateLimiter( rateWindow: number, rateLimit: number ) {
	const interval = rateWindow / rateLimit;

	return function rated( fun, cb ) {
		const lastStartTime = Date.now();

		fun( function afterFun( error ) {
			if( error ) return cb( error );

			const timeTaken = Date.now() - lastStartTime;

			setTimeout( cb, interval - timeTaken );
		} );
	};
}

module.exports = rateLimiter;
