import { IAction } from '../types';

export default class AbstractAction implements IAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options) {
    this.propertyName = options.propertyName;
  }

  getDesc(arg: any): string {
    return this._getPropValueByPropName(arg);
  }

  isValid(arg: any) {
    return !!this._getPropValueByPropName(arg);
  }

  _getPropValueByPropName(obj: any) {
    const arr = this.propertyName.split('.');

    let prop = obj;
    for (let i = 0; i < arr.length; i++) {
      const propName = arr[i];
      prop = prop[propName];
    }

    return prop;
  }

  execute(arg?: any) {
    throw new Error(
      'Should not call execute function of AbstractAction!' + arg
    );
  }
}
