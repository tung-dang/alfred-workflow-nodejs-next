// var Chai = require("chai");
// var should = Chai.should();
// var assert = Chai.assert;
// var sinon = require("sinon");
//
// var AlfredNode = require("../alfredNode.js");
// var workflow = AlfredNode.workflow;
// var storage = AlfredNode.storage;
// var Item = AlfredNode.Item;
// var Utils = AlfredNode.utils;
//
//
// suite("#ActionHandlerTest", function() {
//     var actionHandler = AlfredNode.actionHandler;
//     teardown(function() {
//         actionHandler.clear();
//     });
//
//
//     test("test action handler", function() {
//         var data = "";
//         actionHandler.onAction("action", function(query) {
//             data = query;
//         });
//
//         actionHandler.handle("action", "myquery");
//
//         assert.strictEqual(data, "myquery");
//
//     });
//
//     test("test action handler for empty query", function() {
//         var data = "";
//         actionHandler.onAction("action", function(query) {
//             data = query;
//         });
//
//         actionHandler.handle("action", undefined);
//
//         assert.strictEqual(data, undefined);
//
//     });
//
//
//     test("test action handler is not call for different action", function() {
//         var data = "";
//         actionHandler.onAction("action", function(query) {
//             data = query;
//         });
//
//         actionHandler.handle("actionX", "myquery");
//
//         assert.strictEqual(data, "");
//
//     });
//
//     test("test sub action handler", function() {
//         var data1 = "";
//         var data2 = "";
//         actionHandler.onMenuItemSelected("action", function(query, selectedItemTitle, selectedItemData) {
//             data1 = selectedItemTitle;
//             data2 = query;
//             data3 = selectedItemData;
//         });
//
//         actionHandler.handle("action", "abc" + Utils.SUB_ACTION_SEPARATOR + "myquery");
//         assert.strictEqual(data1, "abc");
//         assert.strictEqual(data2, "myquery");
//         assert.isUndefined(data3);
//     });
//
//     test("test sub action handler with empty query", function() {
//         var data1 = "";
//         var data2 = "";
//         actionHandler.onMenuItemSelected("action", function(query, selectedItem, selectedItemData) {
//             data1 = selectedItem;
//             data2 = query;
//         });
//
//         actionHandler.handle("action", "abc" + Utils.SUB_ACTION_SEPARATOR);
//         assert.strictEqual(data1, "abc");
//         assert.strictEqual(data2, "");
//     });
//
//     test("test action and sub action handler", function() {
//         var data0 = "";
//         var data1 = "";
//         var data2 = "";
//
//         actionHandler.onAction("action", function(query) {
//             data0 = query;
//         });
//
//         actionHandler.onMenuItemSelected("action", function(query, selectedItem) {
//             data1 = selectedItem;
//             data2 = query;
//         });
//
//         actionHandler.handle("action", "myquery");
//         assert.strictEqual(data0, "myquery");
//
//         actionHandler.handle("action", "abc" + Utils.SUB_ACTION_SEPARATOR + "myquery");
//         assert.strictEqual(data1, "abc");
//         assert.strictEqual(data2, "myquery");
//     });
// });
//
// suite("#StorageTest", function() {
//     teardown(function() {
//         storage.clear();
//     });
//
//     test("test set and get item without ttl", function() {
//         var obj = {
//             text: "abc"
//         };
//
//         storage.set("key", obj);
//         var obj2 = storage.get("key");
//         obj.should.equal(obj2);
//     });
//
//     test("test set and get item with ttl is not expired", function(done) {
//         var obj = {
//             text: "abc"
//         };
//
//         storage.set("key", obj, 1000); // ttl is 1s
//         setTimeout(function() {
//             var obj2 = storage.get("key");
//             obj.should.equal(obj2);
//             done();
//         }, 500);
//     });
//
//     test("test set and get item with ttl is expired", function(done) {
//         var obj = {
//             text: "abc"
//         };
//
//         storage.set("key", obj, 1000); // ttl is 1s
//         setTimeout(function() {
//             var obj2 = storage.get("key");
//             should.not.exist(obj2);
//             done();
//         }, 1100);
//     });
//
//     test("test set and get multiple items", function() {
//         var obj1 = {
//             text: "abc"
//         };
//
//         var obj2 = {
//             text: "abc"
//         };
//
//         storage.set("key1", obj1);
//         storage.set("key2", obj2);
//
//         obj1.should.equal(storage.get("key1"));
//         obj2.should.equal(storage.get("key2"));
//     });
//
//     test("test remove item", function() {
//         var obj = {
//             text: "abc"
//         };
//
//         storage.set("key", obj);
//         storage.remove("key");
//
//         var obj2 = storage.get("key");
//         should.not.exist(obj2);
//     });
//
//     test("test clear item", function() {
//         var obj = {
//             text: "abc"
//         };
//
//         storage.set("key", obj);
//         storage.clear();
//
//         var obj2 = storage.get("key");
//         should.not.exist(obj2);
//     });
// });
//
//
// suite("#settings test", function() {
//     var Settings = AlfredNode.settings;
//
//     teardown(function() {
//         Settings.clear();
//     });
//
//     test("test set + get setting", function() {
//         Settings.set("username", "user1");
//
//         var username = Settings.get("username");
//         assert.strictEqual(username, "user1");
//     });
//
//     test("test set + get multiple settings", function() {
//         Settings.set("username", "user1");
//         Settings.set("password", "pass1");
//
//         assert.strictEqual("user1", Settings.get("username"));
//         assert.strictEqual("pass1", Settings.get("password"));
//     });
//
//     test("test remove setting", function() {
//         Settings.set("username", "user1");
//         Settings.remove("username");
//         assert.isUndefined(Settings.get("username"));
//     });
//
//     test("test clear setting", function() {
//         Settings.set("username", "user1");
//         Settings.clear();
//         assert.isUndefined(Settings.get("username"));
//     });
//
//     /*test("test set password", function(done) {
//         settings.setPassword("user1", "mypass");
//         settings.getPassword("user1", function(error, password) {
//             assert.strictEqual(password, "mypass");
//             done();
//         });
//     });*/
// });
//
// suite("#Utils test", function() {
//     test("test filter 1", function() {
//         var list = [{
//             key: "1",
//             name: "This is a pencil"
//         }, {
//             key: "2",
//             name: "This is a pen"
//         }];
//
//         var keyBuilder = function(item) {
//             return item.name;
//         };
//
//         var results = Utils.filter("this is", list, keyBuilder);
//         assert.strictEqual(results.length, 2);
//         assert.strictEqual(results[0].key, "1");
//
//         results = Utils.filter("pencil", list, keyBuilder);
//         assert.strictEqual(results.length, 1);
//         assert.strictEqual(results[0].key, "1");
//
//         results = Utils.filter("abcdef", list, keyBuilder);
//         assert.strictEqual(results.length, 0);
//     });
//
//     test("test generate variables", function() {
//         var data = {
//             arg: 'xyz',
//             variables: {
//                 key: 'value'
//             }
//         }
//
//         var ret = Utils.generateVars(data);
//         assert.strictEqual(ret, '{"alfredworkflow":{"arg":"xyz","variables":{"key":"value"}}}');
//     });
//
//     test("test generate variables with empty variables", function() {
//         var data = {
//             arg: 'xyz'
//         }
//
//         var ret = Utils.generateVars(data);
//         assert.strictEqual(ret, '{"alfredworkflow":{"arg":"xyz"}}');
//     });
//
//     test("test generate variables with empty arg", function() {
//         var data = {
//             variables: {
//                 key: 'value'
//             }
//         }
//
//         var ret = Utils.generateVars(data);
//         assert.strictEqual(ret, '{"alfredworkflow":{"variables":{"key":"value"}}}');
//     });
//
//     test("test generate variables with input is string (not object)", function() {
//         var data = 'string arg';
//
//         var ret = Utils.generateVars(data);
//         assert.strictEqual(ret, 'string arg');
//     });
//
//     test("test generate variables with input is undefined", function() {
//         var data;
//
//         var ret = Utils.generateVars(data);
//         assert.isUndefined(ret);
//     });
//
//     test("test get/set env", function() {
//
//         Utils.envVars.set('key', 'value');
//         assert.strictEqual(Utils.envVars.get('key'), 'value');
//     });
//
//     test("test get/set env for obj", function() {
//
//         Utils.envVars.set('key', {
//             name: 'alex'
//         });
//         assert.strictEqual(Utils.envVars.get('key').name, 'alex');
//     });
//
//     test("test get/set workflow var", function(done) {
//         var wfVars = Utils.wfVars;
//         var ret;
//         wfVars.clear(function(error) {
//             wfVars.set('key', 'value', function(error) {
//                 assert.isUndefined(error);
//
//                 wfVars.get('key', function(err, value) {
//                     assert.isUndefined(error);
//                     ret = value;
//                     assert.strictEqual(ret, 'value');
//                     wfVars.clear();
//                     done();
//                 })
//             });
//         });
//     });
// });
//
// suite("Icons tests", function() {
//     var ICONS = AlfredNode.ICONS;
//     var fs = require("fs");
//
//     test("Check icons exist", function() {
//         assert.isTrue(fs.existsSync(ICONS.ACCOUNT));
//         assert.isTrue(fs.existsSync(ICONS.BURN));
//         assert.isTrue(fs.existsSync(ICONS.CLOCK));
//         assert.isTrue(fs.existsSync(ICONS.COLOR));
//         assert.isTrue(fs.existsSync(ICONS.EJECT));
//         assert.isTrue(fs.existsSync(ICONS.ERROR));
//         assert.isTrue(fs.existsSync(ICONS.FAVORITE));
//         assert.isTrue(fs.existsSync(ICONS.GROUP));
//         assert.isTrue(fs.existsSync(ICONS.HELP));
//         assert.isTrue(fs.existsSync(ICONS.HOME));
//         assert.isTrue(fs.existsSync(ICONS.INFO));
//         assert.isTrue(fs.existsSync(ICONS.NETWORK));
//         assert.isTrue(fs.existsSync(ICONS.NOTE));
//         assert.isTrue(fs.existsSync(ICONS.SETTINGS));
//         assert.isTrue(fs.existsSync(ICONS.SWIRL));
//         assert.isTrue(fs.existsSync(ICONS.SWITCH));
//         assert.isTrue(fs.existsSync(ICONS.SYNC));
//         assert.isTrue(fs.existsSync(ICONS.TRASH));
//         assert.isTrue(fs.existsSync(ICONS.USER));
//         assert.isTrue(fs.existsSync(ICONS.WARNING));
//         assert.isTrue(fs.existsSync(ICONS.WEB));
//     });
// });