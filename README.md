simple "reverse-connect.js" contorl flow library

usable
======

install
-------

	npm install usable

installation
------------

	var usable = require ('usable') ();

each middleware binds on filter and executes in insertion order

context-safeness
----------------

each call of each passed to usable function is context safe, so you can use it with more complicated modules, such as ORM or redis.

but, unfortunalty, this techniqueue limits number of callback arguments up to 7, so be careful.

dependency
----------

only dependensy of usable is sift module, that used for mongodb-like filtering

if you totally sure, that you no need this functionality, feel free to remove sift from node_modules, it will not break other kind of filters.

usage
-----

#### functional filter ####

	usable (function filter (o) {
		return o.val < 0.5;
	}, function middleware (o, next) {
		o.val = Math.round (val);
		next ();
	});
	
	usable ({
		o: Math.random()
	}, function (err, o) {
		console.log (o.a);
	});

#### object filter ####

monogdb-like api

	usable.use ({
		a: {$exists:true}
	}, function (o, next) {
		if (!o.a) {
			next (new Error ("error!"));
		} else {
			next ();
		}
	});
	
	usable ({
		a: "value"
	}, function (err, o) {
		if (err) {
			console.error (err);
		} else {
			console.log (o.a)
		}
	});

#### string and RegExp filters ####

if a string is a only one argument to usable instance, then it compiles to regexp and behave like regexp

	usable.use ("foo", function (text, next) {
		console.log (text);
		next ();
	});
	
	usable ("bar foobaz", function (err, text) {
		console.log (text);
	});


#### more ####

when you instantiate usable function, you can pass it optional global handlers.
each global handler will be called in order of add and runs each time

	var usable = require ('usable') (function (next) {
		// some code here
		next ();
	}, function (next) {
		// some other code here
		next ();
	});
	
	var usable = require ('usable') ([function (next) {
		// some code here
		next ();
	}, function (next) {
		// some other code here
		next ();
	}])

of course, it's not only one way to use multiple global handlers. just call use with array of functions

	usable.use ([function..., function...]);

but, if you add some filter before array of functions, it's ok too:

	usable.use (function..., [function..., function...]);
