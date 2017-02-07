function load(list = "all"){
	if (typeof list !== "string" && !(list instanceof Array)) throw new Error("Load list must be either an array of valid types or a string indicating which.\nValid: String, Array, Object, Number. Also write all as string to load all.");
	let loadobject = function(){
		Object.defineProperty(Object.prototype, "copyme", {
	        value: function() {
	            var obj = {};
	            for(let i in this) {
	                obj[i] = this[i];
	            }
	            return obj;
	        }
	    });
	    Object.defineProperty(Object.prototype, "keysize", {
	    get: function() {
	            return Object.keys(this).length;
	        }
	    });
	    Object.defineProperty(Object.prototype, "map", {
	        value: function(func) {
	            var self = this.copyme();
	            for (let i in self) {
	                self[i] = func(self[i], i, self);
	            }
	            return self;
	        }
	    });
	};
	let loadarray = function(){
		Object.defineProperty(Array.prototype, "last", {
	        get: function() {
	            return this[this.length - 1];
	        },
	        set: function(val) {
	            this[this.length - 1] = val;
	        }
	    });
	    Object.defineProperty(Array.prototype, "first", {
	        get: function() {
	            return this[0];
	        },
	        set: function(val) {
	            this[0] = val;
	        }
	    });
	    Object.defineProperty(Array.prototype, "random", {
	        get: function() {
	            return this[Math.floor(Math.random() * this.length)];
	        },
	        set: function(val) {
	            this[Math.floor(Math.random() * this.length)] = val;
	        }
	    });
	    Object.defineProperty(Array.prototype, "sum", {
	        get: function() {
	            return this.reduce((a,b) => a + b);
	        }
	    });
	    Object.defineProperty(Array.prototype, "mean", {
	        get: function() {
	            return this.sum / this.length;
	        }
	    });
	    Object.defineProperty(Array.prototype, "cleaned", {
	    	get: function() {
	    		let newarr = [];
	    		for (let prop of this) {
	    			if (prop !== undefined)
	    				newarr.push(prop);
	    		}
	    		return newarr;
	    	}
	    });
	    Object.defineProperty(Array.prototype, "cleanme", {
	    	value: function() {
	    		let newarr = [];
	    		for (let prop of this) {
	    			if (prop !== undefined)
	    				newarr.push(prop);
	    		}
	    		for (let forgetthis of this) {
	    			this.pop();
	    		}
	    		for (let key in newarr) {
	    			this[key] = newarr[key];
	    		}
	    		return this;
	    	}
	    });
	    Object.defineProperty(Array.prototype, "testprop", {
	    	get: function() {
	    		return function(tested) {
	    			let check = false;
	    			for (let prop of this) {
	    				if (typeof prop == "string" && typeof tested == "string") {
	    					let testerstuff = new RegExp(`^${prop.replace(/[-.\\\[\]|^$()?+*{}]/g,m=>"\\"+m)}$`, "i");
	    					if (testerstuff.test(tested)) {
	    						check = true;
	    						break;
	    					}
	    				} else {
	    					if (prop === tested) {
	    						check = true;
	    						break;
	    					}
	    				}
	    			}
	    			return check;
	    		};
	    	}
	    });
		Object.defineProperty(Array.prototype, "lastIndex", {
			get() {
				return this.length - 1;
			}
		});
		Array.prototype.tackOn = function(index, val) {
			var unlinked = this.concat([]);
			unlinked[index] += val;
			return unlinked;
		};
		Array.prototype.pullfow = function() {
			let newarr = [];
			this.map((prop, index)=>{
				if (index === 0) {
					newarr.push(this.last);
				} else {
					newarr.push(this[index-1]);
				}
			});
			newarr.map((prop, index)=>this[index]=prop);
			return newarr;
		};
		Array.prototype.pullback = function() {
			let newarr = [];
			this.map((prop, index)=>{
				if (index === this.lastIndex) {
					newarr.push(this[0]);
				} else {
					newarr.push(this[index+1]);
				}
			});
			newarr.map((prop, index)=>this[index]=prop);
			return newarr;
		};
	};
	let loadstring = function(){
		Object.defineProperty(String.prototype, "toJSON", {
	        get: function() {
	            return function(){return JSON.parse(this);};
	        }
	    });
	    Object.defineProperty(String.prototype, "URI", {
	        get: function() {
	            return encodeURI(this);
	        }
	    });
	    Object.defineProperty(String.prototype, "nonURI", {
	        get: function() {
	            return decodeURI(this);
	        }
	    });
	    Object.defineProperty(String.prototype, "toNumber", {
	        get: function() {
	            return function(){return Number(this);};
	        }
	    });
	    String.prototype.getPage = function(pageNumber, count, regex, joinChar = ",") {
		    var matched = this.match(regex);
		    return matched.splice(--pageNumber * count, count).join(joinChar);
		};
	};
	let loadnumber = function(){
		Object.defineProperty(Number.prototype, "toPow", {
			get: function() {
				return function(pow){return Math.pow(this, pow);};
			}
		});
	};
	let temporarytestprop = function(arr, tested) {
		let check = false;
		for (let prop of arr) {
			if (typeof prop == "string" && typeof tested == "string") {
				let testerstuff = new RegExp(`^${prop}$`, "i");
				if (testerstuff.test(tested)) {
					check = true;
					break;
				}
			} else {
				if (prop === tested) {
					check = true;
					break;
				}
			}
		}
		return check;
	};
	if (list instanceof Array) {
		let loadeds = {
			number: false,
			array: false,
			string: false,
			object: false
		};
		for (let load of list) {
			if (temporarytestprop(["Number", "Array", "String", "Object"], load)) {
				let loadd = load.toLowerCase();
				if (loadd == "number") {
					if (!(loadeds.number)) {
						loadnumber();
						loadeds.number = true;
					}
				} else if (loadd == "array") {
					if (!(loadeds.array)) {
						loadarray();
						loadeds.array = true;
					}
				} else if (loadd == "string") {
					if (!(loadeds.string)) {
						loadstring();
						loadeds.string = true;
					}
				} else if (loadd == "object") {
					if (!(loadeds.object)) {
						loadobject();
						loadeds.object = true;
					}
				}
			} else {
				throw new Error("Invalid load argument (at the array). (helpful-prototypes)");
			}
		}
	} else if (typeof list == "string") {
		if (temporarytestprop(["Number", "Array", "String", "Object", "all"], list)) {
			let load = list.toLowerCase();
			if (load == "all") {
				loadobject();
				loadarray();
				loadstring();
				loadnumber();
			} else if (load == "object") {
				loadobject();
			} else if (load == "array") {
				loadarray();
			} else if (load == "string") {
				loadstring();
			} else if (load == "number") {
				loadnumber();
			}
		} else {
			throw new Error("Invalid load argument. (helpful-prototypes)");
		}
	}
	return "Ok!";
}
module.exports = {
	load
};
