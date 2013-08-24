var log = console.log.bind (console);

function safe_apply (fun, args) {
	return fun (
		args[0],
		args[1],
		args[2],
		args[3],
		args[4],
		args[5],
		args[6],
		args[7],
		args[8]
	);
};

function noop () {};

var UNRECOGNIZED_FILTER_TYPE = new Error ("unrecognized filter type");

module.exports = function (globalHandlers) {
	
	var globalHandlers = globalHandlers || Array.prototype.slice(arguments);
	
	function usable (_args, callback) {
	
		var args = [];
	
		args = Array.prototype.slice.call (arguments);
	
		if (typeof arguments[arguments.length-1] === 'function') {
			callback = arguments[arguments.length-1];
			args.pop();
		}
	
		var handlers = usable.handlers;
		var queue = [];
		
		for (var i=0; i<handlers.length; i++) {
			var filter = handlers[i][0];
			var handler = handlers[i][1]
			var accept = false;
			if (typeof filter === 'boolean') {
				accept = filter;
			} else
			if (typeof filter == 'function') {
				accept = safe_apply (filter, args);
			} else
			if (typeof filter == 'object') {
				var sift = require ('sift');
				accept = sift (filter).test (args);
			} else
			if (args.length == 1) {
				var arg = args[0];
				if (typeof filter == 'string') {
					var regexp = new RegExp (filter);
					accept = regexp.test (arg);
				} else
				if (filter instanceof RegExp) {
					accept = filter.test (arg);
				} else {
					return callback (
						UNRECOGNIZED_FILTER_TYPE
					);
				}
			} else {
				return callback (
					UNRECOGNIZED_FILTER_TYPE
				);
			}
		
			if (accept) {
				queue.push (handler);
			}
		}
		
		if (queue.length <= 0) return callback (null);
	
		(function next (err) {
			if (queue.length > 0){
				var handler = queue.pop ();
				safe_apply (handler, args.concat ([next]));
			} else {
				log ('safe_apply', [err].concat(args));
				safe_apply (callback, [err].concat(args));
			}
		})();
	
		return usable;
	
	};

	usable.handlers = [];
	
	// usable#use (filter:boolean||function||object, handlers:[function, ...])
	usable.use = function (filter, handlers) {
	
		if (arguments.length <= 0) return;
	
		if (arguments.length == 1) {
			handlers = arguments[0];
			filter = true;
		}
	
		if (handlers.length <= 0) return;
	
		if (handlers instanceof Array) {
			// do nothing
		} else {
			handlers = [handlers];
		}
	
		for (var i=0; i<handlers.length; i++) {
			var handler = handlers[i];
			usable.handlers.push ([filter, handler]);
		}
		
		return usable;
	};
	
	usable.use (globalHandlers);
	
	return usable;
};