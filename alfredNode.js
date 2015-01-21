// === WorkFlow ===
var Workflow = (function() {
    var _items = [];
    return {
        addItem: function(item) {
            _items.push(item.feedback());
        },

        clearItems: function() {
            _items = [];
        },

        feedback: function() {
            var root = require('xmlbuilder').create('root', {
                version: '1.0',
                encoding: 'UTF-8'
            });

            var ele = root.ele({
                items: _items
            });
            var ret = ele.end();
            console.log(ret);
            return ret;
        }
    };
})();

// === Item ===
function Item(data) {
    // ignore empty value
    data = _removeEmptyProperties(data);

    for (var key in data) {
        this[key] = data[key];
    }
}

Item.prototype.feedback = function() {
    var item = _removeEmptyProperties({
        "@uid": this.uid,
        "@arg": this.arg,
        "@valid": this.valid === true ? "YES" : "NO",
        "@autocomplete": this.autocomplete,
        "title": this.title,
        "subtile": this.subtile,
        "icon": this.icon
    });

    return {
        item: item
    };
};

// === Storage
var Storage = (function() {
    var storage = require('node-persist');
    storage.initSync();

    return {
        set: function(key, value, ttl) {
            var obj = {
                data: value,
                timestamp: new Date().getTime(),
                ttl: ttl || -1
            };

            storage.setItem(key, obj);
        },

        get: function(key) {
            var obj = storage.getItem(key);
            if (obj) {
                var ttl = obj.ttl;
                var timestamp = obj.timestamp;
                // if not ttl => return obj
                if (ttl === -1) {
                    return obj.data;
                } else {
                    // check ttl
                    var now = new Date().getTime();
                    if (now - timestamp < ttl) {
                        return obj.data;
                    }
                }
            }
        },

        remove: function(key) {
            storage.removeItem(key);
        },

        clear: function() {
            storage.clear();
        }
    };
})();

// === Utils
var Utils = (function() {
    var fuzzy = require('fuzzy');
    return {
        filter: function(query, list, keyBuilder) {
            if (!query) {
                return list;
            }

            var options = {
                extract: keyBuilder
            };

            return fuzzy.filter(query, list, options).map(function(item) {
                return item.original;
            });
        }
    };
})();

// === private functions
function _removeEmptyProperties(data) {
    for (var key in data) {
        var value = data[key];
        if (value === undefined || value === null) {
            delete data[key];
        }
    }

    return data;
}

// module export
module.exports = {
    storage: Storage,
    workflow: Workflow,
    Item: Item,
    utils: Utils
};