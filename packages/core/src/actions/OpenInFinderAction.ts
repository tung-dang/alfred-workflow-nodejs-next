import { exec } from 'child_process';
import * as path from 'path';
import AbstractAction from './AbstractAction';

export default class OpenInFinderAction extends AbstractAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options) {
    super(options);

    this.key = options.key || 'open_in_finder';
    this.name = options.name || 'Open in Finder';
    this.icon =
      options.icon || path.resolve(__dirname, '../../icons/finder.png');
    this.propertyName = options.propertyName;
  }

  execute(arg) {
    let command;
    if (typeof arg === 'string') {
      command = `open ${arg}`;
    } else {
      command = `open ${this._getPropValueByPropName(arg)}`;
    }

    return exec(command);
  }
}