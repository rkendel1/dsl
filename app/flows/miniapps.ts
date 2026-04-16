/**
 * @file Mini Apps Flows
 * @description DSL flow definitions for mini apps operations
 */

import { flow, list } from '@stacklive/sdk';

/**
 * List mini apps flow using DSL
 * Uses miniapps.list capability to fetch all mini apps
 * 
 * Reference from issue:
 * list('miniapps') → capability ID: miniapps.list → GET /api/miniapps/list
 * 
 * @example
 * import { runFlow } from '@stacklive/sdk';
 * import { miniappsListFlow } from './flows/miniapps';
 * 
 * const flowAST = miniappsListFlow();
 * const result = await runFlow(flowAST);
 * 
 * if (result.execution.status === 'success') {
 *   const apps = result.execution.results['list-apps']?.output?.apps;
 *   console.log('Mini apps:', apps);
 * }
 */
export const miniappsListFlow = () =>
  flow('miniapps-list')
    .step(list('miniapps', { id: 'list-apps' }))
    .build();
