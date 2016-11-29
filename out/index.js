window.global=window;
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};
	/******/
	/******/ // The require function
	/******/function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;
		/******/
		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };
		/******/
		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		/******/
		/******/ // Flag the module as loaded
		/******/module.loaded = true;
		/******/
		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}
	/******/
	/******/
	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;
	/******/
	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;
	/******/
	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";
	/******/
	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var then_utils_1 = __webpack_require__(1);
	var Sniffr = __webpack_require__(5);
	var Throttle = function () {
		function Throttle() {
			this.inCall = false;
		}
		Throttle.prototype.run = function (func) {
			var _this = this;
			if (this.inCall) return;
			window.requestAnimationFrame(function () {
				func();
				_this.inCall = false;
			});
			this.inCall = true;
		};
		return Throttle;
	}();
	var hero = document.getElementById('hero');
	var heroShuffleText = document.getElementById('heroShuffleText');
	var sniffr = new Sniffr();
	sniffr.sniff(window.navigator.userAgent);
	var spans = Array.prototype.slice.call(heroShuffleText.getElementsByTagName('span'));
	var lastSpan = null;
	var longestSpan = spans.reduce(function (a, b) {
		return a.innerText.length > b.innerText.length ? a : b;
	});
	heroShuffleText.style.width = longestSpan.innerText.length + "ch";
	then_utils_1.asyncFor(spans, function (i, span) {
		if (lastSpan) {
			lastSpan.className = 'passed';
			lastSpan.style.marginTop = null;
		}
		span.className = 'active';
		span.style.marginTop = "0." + (i + 1) + "em";
		//if ((span.dataset as object).img) document.getElementById((span.dataset as object).img).className = 'shown';
		lastSpan = span;
		return then_utils_1.sleep(3000);
	});
	if (sniffr.browser.name !== 'safari') {
		// Safari lags with the listener
		var throttle_1 = new Throttle();
		window.addEventListener('scroll', function () {
			throttle_1.run(function () {
				hero.style.backgroundPosition = "50% " + window.pageYOffset * 0.5 + "px";
			});
		}, {
			passive: true
		});
	} else {}
	//# sourceMappingURL=index.pack.js.map

	/***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process, setImmediate) {
		'use strict';

		var platformSeparator = '/';

		if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && typeof process.platform === 'string' && process.platform === 'win32') {
			platformSeparator = '\\';
		}

		module.exports = {
			callWithPromiseOrCallback: function callWithPromiseOrCallback(func) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				return new Promise(function (resolve, reject) {
					var cb = function cb(err, data) {
						if (err) return reject(err);
						if (typeof data === 'undefined' && typeof res !== 'undefined') return resolve(res);
						resolve(data);
					};
					var res = func.apply(undefined, args.concat([cb]));
					if ((typeof res === "undefined" ? "undefined" : _typeof(res)) === 'object' && typeof res.then === 'function') {
						// if it's then-able, then it's safe to assume it's a Promise, per the Promises/A+ spec
						res.then(resolve, reject);
					}
				});
			},
			returnPromiseOrCallback: function returnPromiseOrCallback(callbackArg, handler) {
				if (typeof callbackArg === 'function') {
					handler(function (data) {
						// resolve
						callbackArg(null, data); // Node-style callback
					}, function (error) {
						// reject
						callbackArg(error, null); // Node-style callback
					});
				} else {
					return new Promise(handler);
				}
			},
			asyncFor: function asyncFor(arr, onloop) {
				return new Promise(function (resolve, reject) {
					if (typeof arr === 'number' || arr instanceof Number) {
						var tmp = arr;
						arr = [];
						for (var i = 0; i < tmp; i++) {
							arr.push(null);
						}
					}
					var keys = Object.keys(arr);
					var doloop = function doloop(i) {
						if (i === keys.length) return resolve();
						try {
							var key = keys[i];
							if (!Number.isNaN(parseInt(key, 10))) key = parseInt(key, 10);
							module.exports.callWithPromiseOrCallback(onloop, key, arr[keys[i]]).then(function () {
								setImmediate(function () {
									return doloop(i + 1);
								});
							}, function (err) {
								reject(err);
							});
						} catch (e) {
							reject(e);
						}
					};
					setImmediate(function () {
						return doloop(0);
					});
				});
			},
			parseArgs: function parseArgs(args) {
				return new Promise(function (resolve, reject) {
					var argRegex = /\-(\-)?([A-Za-z0-9\-]+)/;
					var parsed = {};
					var setValueFor = null;
					module.exports.asyncFor(args, function (i, arg) {
						return new Promise(function (resolve, reject) {
							var match = argRegex.exec(arg);
							if (match === null) {
								if (setValueFor !== null) parsed[setValueFor] = arg;
								setValueFor = null;
								return resolve();
							}
							if (setValueFor !== null) parsed[setValueFor] = true;
							setValueFor = match[2].replace(/-([A-Za-z0-9])/g, function (match, $1) {
								return $1.toUpperCase();
							});
							resolve();
						});
					}).then(function () {
						if (setValueFor !== null) parsed[setValueFor] = true;
						resolve(parsed);
					}).catch(reject);
				});
			},
			sleep: function sleep(ms) {
				return new Promise(function (resolve, reject) {
					setTimeout(function () {
						resolve();
					}, ms);
				});
			},
			asyncWhile: function asyncWhile(oneval, onloop) {
				return new Promise(function (resolve, reject) {
					var doloop = function doloop() {
						var res = oneval();
						if (!res) return resolve();
						try {
							module.exports.callWithPromiseOrCallback(onloop).then(function (shouldBreak) {
								if (shouldBreak) return resolve();
								setImmediate(function () {
									return doloop();
								});
							}, function (err) {
								reject(err);
							});
						} catch (e) {
							reject(e);
						}
					};
					setImmediate(function () {
						return doloop();
					});
				});
			}
		};

		try {
			(function () {
				var fs = __webpack_require__(!function webpackMissingModule() {
					var e = new Error("Cannot find module \"fs\"");e.code = 'MODULE_NOT_FOUND';throw e;
				}());
				Object.assign(module.exports, {
					rmrf: function rmrf(pathname) {
						return new Promise(function (resolve, reject) {
							var rmUnknown = void 0;

							var rmFile = function rmFile(pathname) {
								return new Promise(function (resolve, reject) {
									fs.unlink(pathname, function (err) {
										if (err) return reject(err);
										resolve();
									});
								});
							};

							var rmFolder = function rmFolder(pathname) {
								return new Promise(function (resolve, reject) {
									fs.readdir(pathname, function (err, files) {
										if (err) return reject(err);
										module.exports.asyncFor(files, function (i, file) {
											return rmUnknown("" + pathname + platformSeparator + file);
										}).then(function () {
											fs.rmdir(pathname, function (err) {
												if (err) return reject(err);
												resolve();
											});
										}).catch(reject);
									});
								});
							};

							rmUnknown = function rmUnknown(pathname) {
								return new Promise(function (resolve, reject) {
									fs.stat(pathname, function (err, stats) {
										if (err) {
											if (err.code === 'ENOENT') return resolve();
											return reject(err);
										}
										if (stats.isDirectory()) {
											rmFolder(pathname).then(resolve).catch(reject);
										} else {
											rmFile(pathname).then(resolve).catch(reject);
										}
									});
								});
							};

							rmUnknown(pathname).then(resolve).catch(reject);
						});
					},
					mkdirp: function mkdirp(pathname) {
						return new Promise(function (resolve, reject) {
							var parts = pathname.split(platformSeparator);
							var str = platformSeparator;
							if (parts[0] === '') {
								parts.shift();
							} else if (/([A-Z]):/.test(parts[0])) {
								str = parts.shift() + platformSeparator;
							}
							module.exports.asyncFor(parts, function (i, part) {
								return new Promise(function (resolve, reject) {
									str += part;
									fs.stat(str, function (err, stats) {
										if (err) {
											if (err.code === 'ENOENT') {
												return fs.mkdir(str, function (err) {
													if (err) {
														if (err.code === 'EEXIST') {
															str += platformSeparator;
															return resolve();
														} else {
															return reject(err);
														}
													}
													str += platformSeparator;
													resolve();
												});
											} else if (err.code === 'EEXIST') {
												str += platformSeparator;
												return resolve();
											}
											return reject(err);
										}
										str += platformSeparator;
										resolve();
									});
								});
							}).then(resolve).catch(reject);
						});
					},
					writeFile: function writeFile() {
						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						return new Promise(function (resolve, reject) {
							fs.writeFile.apply(fs, args.concat([function (err) {
								if (err) return reject(err);
								resolve();
							}]));
						});
					},
					readFile: function readFile() {
						for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
							args[_key3] = arguments[_key3];
						}

						return new Promise(function (resolve, reject) {
							fs.readFile.apply(fs, args.concat([function (err, cont) {
								if (err) return reject(err);
								resolve(cont);
							}]));
						});
					},
					mv: function mv(oldpath, newpath) {
						return new Promise(function (resolve, reject) {
							fs.rename(oldpath, newpath, function (err) {
								if (err) return reject(err);
								resolve();
							});
						});
					},
					cpr: function cpr(frompath, topath) {
						return new Promise(function (resolve, reject) {
							var cpUnknown = void 0;

							var cpFile = function cpFile(frompath, topath) {
								return new Promise(function (resolve, reject) {
									var readStream = fs.createReadStream(frompath);
									var writeStream = fs.createWriteStream(topath);

									readStream.on('error', function (err) {
										readStream.destroy();
										writeStream.destroy();
										reject(err);
									});

									writeStream.on('error', function (err) {
										writeStream.destroy();
										readStream.destroy();
										reject(err);
									});

									writeStream.on('finish', resolve);

									readStream.pipe(writeStream);
								});
							};

							var cpFolder = function cpFolder(frompath, topath) {
								return new Promise(function (resolve, reject) {
									fs.readdir(frompath, function (err, files) {
										if (err) return reject(err);
										module.exports.mkdirp(topath).then(function () {
											return module.exports.asyncFor(files, function (i, file) {
												return cpUnknown("" + frompath + platformSeparator + file, "" + topath + platformSeparator + file);
											});
										}).then(resolve).catch(reject);
									});
								});
							};

							cpUnknown = function cpUnknown(frompath, topath) {
								return new Promise(function (resolve, reject) {
									fs.stat(frompath, function (err, stats) {
										if (err) return reject(err);
										if (stats.isDirectory()) {
											cpFolder(frompath, topath).then(resolve).catch(reject);
										} else {
											cpFile(frompath, topath).then(resolve).catch(reject);
										}
									});
								});
							};

							cpUnknown(frompath, topath).then(resolve).catch(reject);
						});
					},
					readdir: function readdir(dir) {
						var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { recursive: false, encoding: undefined },
						    _ref$recursive = _ref.recursive,
						    recursive = _ref$recursive === undefined ? false : _ref$recursive,
						    _ref$encoding = _ref.encoding,
						    encoding = _ref$encoding === undefined ? undefined : _ref$encoding;

						return new Promise(function (resolve, reject) {
							fs.readdir(dir, {
								encoding: encoding
							}, function (err, files) {
								if (err) return reject(err);
								if (!recursive) return resolve(files);
								var res = files;
								module.exports.asyncFor(files, function (i, file) {
									return new Promise(function (resolve, reject) {
										fs.stat("" + dir + platformSeparator + file, function (err, stats) {
											if (err) return reject(err);
											if (stats.isDirectory()) {
												module.exports.readdir("" + dir + platformSeparator + file, {
													recursive: recursive,
													encoding: encoding
												}).then(function (files) {
													return module.exports.asyncFor(files, function (i, file2) {
														res.push("" + file + platformSeparator + file2);
														return Promise.resolve();
													});
												}).then(resolve).catch(reject);
											} else {
												resolve();
											}
										});
									});
								}).then(function () {
									resolve(res);
								}).catch(reject);
							});
						});
					}
				});
				try {
					(function () {
						var _webpack_require__ = __webpack_require__(4),
						    extname = _webpack_require__.extname;

						Object.assign(module.exports, {
							filterByExtension: function filterByExtension(pathname, ext) {
								var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { recursive: false },
								    _ref2$recursive = _ref2.recursive,
								    recursive = _ref2$recursive === undefined ? false : _ref2$recursive;

								return new Promise(function (resolve, reject) {
									module.exports.readdir(pathname, {
										recursive: recursive
									}).then(function (files) {
										var res = [];
										module.exports.asyncFor(files, function (i, file) {
											return new Promise(function (resolve, reject) {
												if (extname(file) === ext) res.push(pathname + "/" + file);
												resolve();
											});
										}).then(function () {
											return resolve(res);
										}).catch(reject);
									}).catch(reject);
								});
							}
						});
					})();
				} catch (e) {
					// do nothing
				}
			})();
		} catch (e) {
			// do nothing
		}

		try {
			(function () {
				var _webpack_require__2 = __webpack_require__(!function webpackMissingModule() {
					var e = new Error("Cannot find module \"child_process\"");e.code = 'MODULE_NOT_FOUND';throw e;
				}()),
				    _exec = _webpack_require__2.exec,
				    _spawn = _webpack_require__2.spawn;

				Object.assign(module.exports, {
					exec: function exec() {
						for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
							args[_key4] = arguments[_key4];
						}

						return new Promise(function (resolve, reject) {
							_exec.apply(undefined, args.concat([function (err, stdout, stderr) {
								if (err) return reject(err);
								resolve({
									stdout: stdout,
									stderr: stderr
								});
							}]));
						});
					},
					spawn: function spawn() {
						var cmd = _spawn.apply(undefined, arguments);
						var p = new Promise(function (resolve, reject) {
							cmd.on('close', resolve);
							cmd.on('error', reject);
						});
						p.cmd = cmd;
						return p;
					}
				});
			})();
		} catch (e) {}
		// do nothing


		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(2), __webpack_require__(3).setImmediate);

	/***/
},
/* 2 */
/***/function (module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
		throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
		throw new Error('clearTimeout has not been defined');
	}
	(function () {
		try {
			if (typeof setTimeout === 'function') {
				cachedSetTimeout = setTimeout;
			} else {
				cachedSetTimeout = defaultSetTimout;
			}
		} catch (e) {
			cachedSetTimeout = defaultSetTimout;
		}
		try {
			if (typeof clearTimeout === 'function') {
				cachedClearTimeout = clearTimeout;
			} else {
				cachedClearTimeout = defaultClearTimeout;
			}
		} catch (e) {
			cachedClearTimeout = defaultClearTimeout;
		}
	})();
	function runTimeout(fun) {
		if (cachedSetTimeout === setTimeout) {
			//normal enviroments in sane situations
			return setTimeout(fun, 0);
		}
		// if setTimeout wasn't available but was latter defined
		if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
			cachedSetTimeout = setTimeout;
			return setTimeout(fun, 0);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedSetTimeout(fun, 0);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
				return cachedSetTimeout.call(null, fun, 0);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
				return cachedSetTimeout.call(this, fun, 0);
			}
		}
	}
	function runClearTimeout(marker) {
		if (cachedClearTimeout === clearTimeout) {
			//normal enviroments in sane situations
			return clearTimeout(marker);
		}
		// if clearTimeout wasn't available but was latter defined
		if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
			cachedClearTimeout = clearTimeout;
			return clearTimeout(marker);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedClearTimeout(marker);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
				return cachedClearTimeout.call(null, marker);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
				// Some versions of I.E. have different rules for clearTimeout vs setTimeout
				return cachedClearTimeout.call(this, marker);
			}
		}
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
		if (!draining || !currentQueue) {
			return;
		}
		draining = false;
		if (currentQueue.length) {
			queue = currentQueue.concat(queue);
		} else {
			queueIndex = -1;
		}
		if (queue.length) {
			drainQueue();
		}
	}

	function drainQueue() {
		if (draining) {
			return;
		}
		var timeout = runTimeout(cleanUpNextTick);
		draining = true;

		var len = queue.length;
		while (len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) {
				if (currentQueue) {
					currentQueue[queueIndex].run();
				}
			}
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = null;
		draining = false;
		runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
		var args = new Array(arguments.length - 1);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
		}
		queue.push(new Item(fun, args));
		if (queue.length === 1 && !draining) {
			runTimeout(drainQueue);
		}
	};

	// v8 likes predictible objects
	function Item(fun, array) {
		this.fun = fun;
		this.array = array;
	}
	Item.prototype.run = function () {
		this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
		throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
		return '/';
	};
	process.chdir = function (dir) {
		throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
		return 0;
	};

	/***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (setImmediate, clearImmediate) {
		var nextTick = __webpack_require__(2).nextTick;
		var apply = Function.prototype.apply;
		var slice = Array.prototype.slice;
		var immediateIds = {};
		var nextImmediateId = 0;

		// DOM APIs, for completeness

		exports.setTimeout = function () {
			return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
		};
		exports.setInterval = function () {
			return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
		};
		exports.clearTimeout = exports.clearInterval = function (timeout) {
			timeout.close();
		};

		function Timeout(id, clearFn) {
			this._id = id;
			this._clearFn = clearFn;
		}
		Timeout.prototype.unref = Timeout.prototype.ref = function () {};
		Timeout.prototype.close = function () {
			this._clearFn.call(window, this._id);
		};

		// Does not start the time, just sets up the members needed.
		exports.enroll = function (item, msecs) {
			clearTimeout(item._idleTimeoutId);
			item._idleTimeout = msecs;
		};

		exports.unenroll = function (item) {
			clearTimeout(item._idleTimeoutId);
			item._idleTimeout = -1;
		};

		exports._unrefActive = exports.active = function (item) {
			clearTimeout(item._idleTimeoutId);

			var msecs = item._idleTimeout;
			if (msecs >= 0) {
				item._idleTimeoutId = setTimeout(function onTimeout() {
					if (item._onTimeout) item._onTimeout();
				}, msecs);
			}
		};

		// That's not how node.js implements it but the exposed api is the same.
		exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
			var id = nextImmediateId++;
			var args = arguments.length < 2 ? false : slice.call(arguments, 1);

			immediateIds[id] = true;

			nextTick(function onNextTick() {
				if (immediateIds[id]) {
					// fn.call() is faster so we optimize for the common use-case
					// @see http://jsperf.com/call-apply-segu
					if (args) {
						fn.apply(null, args);
					} else {
						fn.call(null);
					}
					// Prevent ids from leaking
					exports.clearImmediate(id);
				}
			});

			return id;
		};

		exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
			delete immediateIds[id];
		};
		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate);

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process) {
		// Copyright Joyent, Inc. and other Node contributors.
		//
		// Permission is hereby granted, free of charge, to any person obtaining a
		// copy of this software and associated documentation files (the
		// "Software"), to deal in the Software without restriction, including
		// without limitation the rights to use, copy, modify, merge, publish,
		// distribute, sublicense, and/or sell copies of the Software, and to permit
		// persons to whom the Software is furnished to do so, subject to the
		// following conditions:
		//
		// The above copyright notice and this permission notice shall be included
		// in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
		// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
		// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
		// USE OR OTHER DEALINGS IN THE SOFTWARE.

		// resolves . and .. elements in a path array with directory names there
		// must be no slashes, empty elements, or device names (c:\) in the array
		// (so also no leading and trailing slashes - it does not distinguish
		// relative and absolute paths)
		function normalizeArray(parts, allowAboveRoot) {
			// if the path tries to go above the root, `up` ends up > 0
			var up = 0;
			for (var i = parts.length - 1; i >= 0; i--) {
				var last = parts[i];
				if (last === '.') {
					parts.splice(i, 1);
				} else if (last === '..') {
					parts.splice(i, 1);
					up++;
				} else if (up) {
					parts.splice(i, 1);
					up--;
				}
			}

			// if the path is allowed to go above the root, restore leading ..s
			if (allowAboveRoot) {
				for (; up--; up) {
					parts.unshift('..');
				}
			}

			return parts;
		}

		// Split a filename into [root, dir, basename, ext], unix version
		// 'root' is just a slash, or nothing.
		var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
		var splitPath = function splitPath(filename) {
			return splitPathRe.exec(filename).slice(1);
		};

		// path.resolve([from ...], to)
		// posix version
		exports.resolve = function () {
			var resolvedPath = '',
			    resolvedAbsolute = false;

			for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
				var path = i >= 0 ? arguments[i] : process.cwd();

				// Skip empty and invalid entries
				if (typeof path !== 'string') {
					throw new TypeError('Arguments to path.resolve must be strings');
				} else if (!path) {
					continue;
				}

				resolvedPath = path + '/' + resolvedPath;
				resolvedAbsolute = path.charAt(0) === '/';
			}

			// At this point the path should be resolved to a full absolute path, but
			// handle relative paths to be safe (might happen when process.cwd() fails)

			// Normalize the path
			resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
				return !!p;
			}), !resolvedAbsolute).join('/');

			return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
		};

		// path.normalize(path)
		// posix version
		exports.normalize = function (path) {
			var isAbsolute = exports.isAbsolute(path),
			    trailingSlash = substr(path, -1) === '/';

			// Normalize the path
			path = normalizeArray(filter(path.split('/'), function (p) {
				return !!p;
			}), !isAbsolute).join('/');

			if (!path && !isAbsolute) {
				path = '.';
			}
			if (path && trailingSlash) {
				path += '/';
			}

			return (isAbsolute ? '/' : '') + path;
		};

		// posix version
		exports.isAbsolute = function (path) {
			return path.charAt(0) === '/';
		};

		// posix version
		exports.join = function () {
			var paths = Array.prototype.slice.call(arguments, 0);
			return exports.normalize(filter(paths, function (p, index) {
				if (typeof p !== 'string') {
					throw new TypeError('Arguments to path.join must be strings');
				}
				return p;
			}).join('/'));
		};

		// path.relative(from, to)
		// posix version
		exports.relative = function (from, to) {
			from = exports.resolve(from).substr(1);
			to = exports.resolve(to).substr(1);

			function trim(arr) {
				var start = 0;
				for (; start < arr.length; start++) {
					if (arr[start] !== '') break;
				}

				var end = arr.length - 1;
				for (; end >= 0; end--) {
					if (arr[end] !== '') break;
				}

				if (start > end) return [];
				return arr.slice(start, end - start + 1);
			}

			var fromParts = trim(from.split('/'));
			var toParts = trim(to.split('/'));

			var length = Math.min(fromParts.length, toParts.length);
			var samePartsLength = length;
			for (var i = 0; i < length; i++) {
				if (fromParts[i] !== toParts[i]) {
					samePartsLength = i;
					break;
				}
			}

			var outputParts = [];
			for (var i = samePartsLength; i < fromParts.length; i++) {
				outputParts.push('..');
			}

			outputParts = outputParts.concat(toParts.slice(samePartsLength));

			return outputParts.join('/');
		};

		exports.sep = '/';
		exports.delimiter = ':';

		exports.dirname = function (path) {
			var result = splitPath(path),
			    root = result[0],
			    dir = result[1];

			if (!root && !dir) {
				// No dirname whatsoever
				return '.';
			}

			if (dir) {
				// It has a dirname, strip trailing slash
				dir = dir.substr(0, dir.length - 1);
			}

			return root + dir;
		};

		exports.basename = function (path, ext) {
			var f = splitPath(path)[2];
			// TODO: make this comparison case-insensitive on windows?
			if (ext && f.substr(-1 * ext.length) === ext) {
				f = f.substr(0, f.length - ext.length);
			}
			return f;
		};

		exports.extname = function (path) {
			return splitPath(path)[3];
		};

		function filter(xs, f) {
			if (xs.filter) return xs.filter(f);
			var res = [];
			for (var i = 0; i < xs.length; i++) {
				if (f(xs[i], i, xs)) res.push(xs[i]);
			}
			return res;
		}

		// String.prototype.substr - negative index don't work in IE8
		var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
			return str.substr(start, len);
		} : function (str, start, len) {
			if (start < 0) start = str.length + start;
			return str.substr(start, len);
		};

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(2));

	/***/
},
/* 5 */
/***/function (module, exports) {

	(function (host) {

		var properties = {
			browser: [[/msie ([\.\_\d]+)/, "ie"], [/trident\/.*?rv:([\.\_\d]+)/, "ie"], [/firefox\/([\.\_\d]+)/, "firefox"], [/chrome\/([\.\_\d]+)/, "chrome"], [/version\/([\.\_\d]+).*?safari/, "safari"], [/mobile safari ([\.\_\d]+)/, "safari"], [/android.*?version\/([\.\_\d]+).*?safari/, "com.android.browser"], [/crios\/([\.\_\d]+).*?safari/, "chrome"], [/opera/, "opera"], [/opera\/([\.\_\d]+)/, "opera"], [/opera ([\.\_\d]+)/, "opera"], [/opera mini.*?version\/([\.\_\d]+)/, "opera.mini"], [/opios\/([a-z\.\_\d]+)/, "opera"], [/blackberry/, "blackberry"], [/blackberry.*?version\/([\.\_\d]+)/, "blackberry"], [/bb\d+.*?version\/([\.\_\d]+)/, "blackberry"], [/rim.*?version\/([\.\_\d]+)/, "blackberry"], [/iceweasel\/([\.\_\d]+)/, "iceweasel"], [/edge\/([\.\d]+)/, "edge"]],
			os: [[/linux ()([a-z\.\_\d]+)/, "linux"], [/mac os x/, "macos"], [/mac os x.*?([\.\_\d]+)/, "macos"], [/os ([\.\_\d]+) like mac os/, "ios"], [/openbsd ()([a-z\.\_\d]+)/, "openbsd"], [/android/, "android"], [/android ([a-z\.\_\d]+);/, "android"], [/mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/, "firefoxos"], [/windows\s*(?:nt)?\s*([\.\_\d]+)/, "windows"], [/windows phone.*?([\.\_\d]+)/, "windows.phone"], [/windows mobile/, "windows.mobile"], [/blackberry/, "blackberryos"], [/bb\d+/, "blackberryos"], [/rim.*?os\s*([\.\_\d]+)/, "blackberryos"]],
			device: [[/ipad/, "ipad"], [/iphone/, "iphone"], [/lumia/, "lumia"], [/htc/, "htc"], [/nexus/, "nexus"], [/galaxy nexus/, "galaxy.nexus"], [/nokia/, "nokia"], [/ gt\-/, "galaxy"], [/ sm\-/, "galaxy"], [/xbox/, "xbox"], [/(?:bb\d+)|(?:blackberry)|(?: rim )/, "blackberry"]]
		};

		var UNKNOWN = "Unknown";

		var propertyNames = Object.keys(properties);

		function Sniffr() {
			var self = this;

			propertyNames.forEach(function (propertyName) {
				self[propertyName] = {
					name: UNKNOWN,
					version: [],
					versionString: UNKNOWN
				};
			});
		}

		function determineProperty(self, propertyName, userAgent) {
			properties[propertyName].forEach(function (propertyMatcher) {
				var propertyRegex = propertyMatcher[0];
				var propertyValue = propertyMatcher[1];

				var match = userAgent.match(propertyRegex);

				if (match) {
					self[propertyName].name = propertyValue;

					if (match[2]) {
						self[propertyName].versionString = match[2];
						self[propertyName].version = [];
					} else if (match[1]) {
						self[propertyName].versionString = match[1].replace(/_/g, ".");
						self[propertyName].version = parseVersion(match[1]);
					} else {
						self[propertyName].versionString = UNKNOWN;
						self[propertyName].version = [];
					}
				}
			});
		}

		function parseVersion(versionString) {
			return versionString.split(/[\._]/).map(function (versionPart) {
				return parseInt(versionPart);
			});
		}

		Sniffr.prototype.sniff = function (userAgentString) {
			var self = this;
			var userAgent = (userAgentString || navigator.userAgent || "").toLowerCase();

			propertyNames.forEach(function (propertyName) {
				determineProperty(self, propertyName, userAgent);
			});
		};

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = Sniffr;
		} else {
			host.Sniffr = new Sniffr();
			host.Sniffr.sniff(navigator.userAgent);
		}
	})(this);

	/***/
}
/******/]);
//# sourceMappingURL=index.js.map