import * as events from 'events';
// import * as fs from 'fs';

import { ICON_LOADING, ICON_ERROR, ICON_INFO, ICON_WARNING, SUB_ACTION_DIVIDER_SYMBOL, WF_DATA_KEY } from "./constants";
import storage from './storage';
import Item from './Item';
import { debug } from './utilities';
import { AlfredItem, AlfredResult, FeedbackOptions } from './types';

const ACTION_NAMESPACE_EVENT = 'action';
const SUB_ACTION_NAMESPACE_EVENT = 'subActionSelected';
const MAXIMUM_ITEMS_TO_SHOW = 20;

export default class Workflow {
  _items: AlfredItem[];
  _name: string;
  _eventEmitter: events.EventEmitter;
  _env: any;

  constructor(options) {
    options = options || {};

    this._items = [];
    this._name = 'AlfredWfNodeJs';
    this._eventEmitter = new events.EventEmitter();
    this._env = process.env;
    this.log('- config:', process.env);
  }

  static _saveItemArg(item) {
    let wfData = storage.get(WF_DATA_KEY) || {};
    const data = item.getAlfredItemData();
    wfData[data.title] = data.arg;
    storage.set(WF_DATA_KEY, wfData);
  }

  static _getItemArg(itemTitle) {
    const wfData = storage.get(WF_DATA_KEY);
    return wfData ? wfData[itemTitle] : undefined;
  }

  static _getActionName(action) {
    return `${ACTION_NAMESPACE_EVENT}-${action}`;
  }

  static _getSubActionName(action) {
    return `${SUB_ACTION_NAMESPACE_EVENT}-${action}`;
  }

  start() {
    const args = Array.prototype.slice.apply(this, arguments);
    let actionName;
    let query;

    if (args.length === 0) {
      actionName = process.argv[2];
      query = process.argv[3];
    } else {
      actionName = args[0];
      query = args[1];
    }

    this.log('- action name:', actionName);
    this.log('- query:', query);

    process.on('uncaughtException', this.error);

    this._trigger(actionName, query);
  }

  /**
   * Add one feedback item
   */
  addItem = (item: Item) => {
    if (item instanceof Item) {
      Workflow._saveItemArg(item);
      this._items.push(item.getAlfredItemData());
    } else {
      this.error('ERROR: item is not an instance of Item class!');
    }
  };

  /**
   * Add many feedback items
   */
  addItems(items) {
    items.forEach(this.addItem);
  }

  /**
   * Clear all feedback items
   */
  clearItems() {
    this._items = [];
  }

  /**
   * Set workflow name
   */
  setName(name) {
    this._name = name;
  }

  /**
   * Get workflow name
   */
  getName() {
    return this._name;
  }

  feedback(options?: FeedbackOptions) {
    let strOutput;

    try {
      if (!this._items.length) {
        this.log('no items in Workflow outputs');
        return;
      }

      // for optimizing performance, we just shows first 20 items
      const first20Items: AlfredItem[] = this._items.splice(0, MAXIMUM_ITEMS_TO_SHOW - 1);
      if (this._items.length > MAXIMUM_ITEMS_TO_SHOW) {
        const hasMoreItem = new Item({
          title: "Has more...",
          subtitle: "Please type something to filter.",
          icon: ICON_INFO
        });
        first20Items.push(hasMoreItem.getAlfredItemData())
      }

      strOutput = JSON.stringify(
        {
          items: first20Items,
          rerun: options && options.rerun ? options.rerun : undefined,
          // variables:
        } as AlfredResult,
        null,
        '  '
      );

      this.log('Workflow feedback: ');
      // fs.writeFileSync('test-json-_output.json', strOutput);
      this._output(strOutput);
      // this.clearItems();

      return strOutput;
    } catch (e) {
      this.log('Can not generate JSON string', this._items);
    }

    return strOutput;
  }

  /**
   * Generate info fedback
   */
  info(title, subtitle = '') {
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        icon: ICON_INFO
      })
    );

    return this.feedback();
  }

  /**
   * Generating warning feedback
   */
  warning(title, subtitle) {
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        icon: ICON_WARNING
      })
    );

    return this.feedback();
  }

  /**
   * Generating error feedback
   */
  error = (title, subtitle = '') => {
    this.log('Error: ', title, subtitle);
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        icon: ICON_ERROR
      })
    );

    return this.feedback();
  };

  /**
   * Show loading data
   */
  showLoading(title?: string, subtitle?: string) {
    this.clearItems();

    this.addItem(
      new Item({
        title: title || 'Loading',
        subtitle: subtitle || 'Fetching data...Please wait a little bit.',
        icon: ICON_LOADING
      })
    );

    return this.feedback({
      rerun: 0.1
    });
  }

  /**
   * Register action handler
   */
  onAction(actionName, handler) {
    if (typeof actionName !== 'string' || typeof handler !== 'function') {
      console.error('ERROR - action and handler should be defined!');
      return;
    }

    this._eventEmitter.on(Workflow._getActionName(actionName), handler);
  }

  /**
   * Register menu item selected handler
   */
  onSubActionSelected(actioName, handler) {
    if (!actioName || !handler) {
      console.error('ERROR - action and handler should be defined!');
      return;
    }

    this._eventEmitter.on(Workflow._getSubActionName(actioName), handler);
  }

  /**
   * Handle action by delegate to registered action/subAction handlers
   */
  _trigger(actionName, query) {
    const tempQuery = this._sanitizeQuery(query);

    // handle first level action
    if (
      !tempQuery ||
      typeof tempQuery === 'object' ||
      (typeof tempQuery === 'string' &&
        tempQuery.indexOf(SUB_ACTION_DIVIDER_SYMBOL) === -1)
    ) {
      this._eventEmitter.emit(Workflow._getActionName(actionName), tempQuery);
      return;
    }

    // handle sub action
    const arrays = tempQuery.split(SUB_ACTION_DIVIDER_SYMBOL);

    if (arrays.length >= 2) {
      const previousActionTitleSelected = this._sanitizeQuery(
        arrays[arrays.length - 2]
      );
      query = this._sanitizeQuery(arrays[arrays.length - 1]); // last string is query

      let previousArgActionSelected = Workflow._getItemArg(
        previousActionTitleSelected
      );
      try {
        previousArgActionSelected = JSON.parse(previousArgActionSelected);
      } catch (e) {
        this.log('Can not convert arg string into Object!');
      }

      this._eventEmitter.emit(
        Workflow._getSubActionName(actionName),
        query,
        previousActionTitleSelected,
        previousArgActionSelected
      );
    }
  }

  /**
   * Clear everything.
   */
  destroy() {
    this._items = [];
    this._name = '';
    this._eventEmitter.removeAllListeners();
    storage.clear();
  }

  _sanitizeQuery(rawQuery) {
    let finalQuery = rawQuery;

    try {
      finalQuery = JSON.parse(rawQuery);
    } catch (e) {
      // can not parse to object, we keep it as string
      finalQuery = rawQuery;
    }

    finalQuery = finalQuery && finalQuery.trim ? finalQuery.trim() : finalQuery;
    return finalQuery;
  }

  /* istanbul ignore next */
  _output(str) {
    try {
      this.log('Workflow feedback: ');
      if (this.isDebug() || process.env.NODE_ENV === 'testing') {
        this.log(str);
      }
      console.log(str);
    } catch (e) {
      this.log('Can not generate JSON string', this._items);
    }
  }

  log(message, ...args) {
    if (this.isDebug()) {
      debug(message, ...args);
    }
  }

  isDebug(): boolean {
    return !!this._env['alfred_debug'];
  }

  getConfig(key: string): any{
    const value = this._env[key];
    if (value) {
      this.log('Maybe you forget to set config for key=', key);
    }
    return value;
  }
}
