import * as fuzzy from 'fuzzy';
import * as appleScript from 'node-osascript';
import storage from './storage';

export function debug(message, ...args) {
  // do not log message in test environment
  if (process.env.NODE_ENV === 'testing') {
    return;
  }

  console.warn(message, ...args);
}

export function filter(query, list, keyBuilder) {
  if (!query) {
    return list;
  }

  const options = {
    extract: keyBuilder ? keyBuilder : item => item.toString()
  };

  return fuzzy.filter(query, list, options).map(item => item.original);
}

/**
 * a wrapper of "applescript" module
 * @type {Object}
 */
export const applescript = {
  /**
   * execute script
   * @param script
   * @param handler: function(err, result)
   */
  /* istanbul ignore next */
  execute: function(script, handler) {
    appleScript.execute(script, handler);
  },

  /**
   * execute script file
   * @param path to script file
   * @param variable variable
   * @param handler: function(err, result, raw)
   */
  /* istanbul ignore next */
  executeFile: function(/*path, varibale, handler*/) {
    appleScript.executeFile.apply(this, arguments);
  }
};

export function memorizePromise(keyCache, ttl, func, isDebug) {
  ttl = ttl || true; // true means 24 caching

  const dataFromCache = storage.get(keyCache);
  if (dataFromCache && !isDebug) {
    debug('Get data from cache with key=', keyCache);
    return new Promise(resolve => resolve(dataFromCache));
  }

  debug(
    'Start to get new fresh data since can not find data from cache: ',
    keyCache
  );
  return func().then(data => {
    debug('Save data to cache, key=', keyCache);
    debug('data=', data);
    storage.set(keyCache, data, ttl);
    return data;
  });
}
