import { Item, utils as nodeJSUtils } from '@alfred-wf-node/core';
import executors from '../executors.js';
import { CommandParams } from '../types';

export default class LoadProjectActions {
  wf: any;

  constructor(options) {
    this.wf = options.wf;
  }

  executeLoadActionsOfProject = (query: string,
                                 previousSelectedTitle: string,
                                 previousSelectedArg: CommandParams) => {
    this.wf.log('previousSelectedTitle: ', previousSelectedTitle);
    this.wf.log('previousSelectedArg: ', previousSelectedArg);

    const projectActions = executors;

    const filteredActions = nodeJSUtils.filter(query, projectActions, function(
      projectAction
    ) {
      return projectAction.filterKey
        ? projectAction.filterKey().toLowerCase()
        : '';
    });

    if (filteredActions.length === 0) {
      return;
    }

    const items: Item[] = [];

    filteredActions.forEach(projectAction => {
      const item: Item = projectAction.build ? projectAction.build(previousSelectedArg) : null;

      if (item) {
        items.push(item);
      }
    });

    this.wf.addItems(items);
    this.wf.feedback();
  };
}