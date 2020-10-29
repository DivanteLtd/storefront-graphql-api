import { apiStatus } from '@storefront-api/lib/util';
import { Router } from 'express';
import Logger from '@storefront-api/lib/logger'
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config, db }) => {
  const mcApi = Router();

  /**
   * This is just an example on how to extend magento2 api client and get the cms blocks
   * https://devdocs.magento.com/swagger/#!/cmsBlockRepositoryV1/cmsBlockRepositoryV1GetListGet
   *
   * NOTICE: storefront-api should be platform agnostic. This is just for the customization example
   */
  mcApi.get('/cmsBlock', (req, res) => {
    const client = Magento2Client(config.magento2.api);
    client.addMethods('cmsBlock', (restClient) => {
      const module: Record<string, (...args: any[]) => any> = {};

      module.search = function () {
        return restClient.get('/cmsPage/search');
      }
      return module;
    })
    Logger.info(client)
    client.cmsBlock.search().then((result) => {
      apiStatus(res, result, 200); // just dump it to the browser, result = JSON object
    }).catch(err => {
      apiStatus(res, err, 500);
    })
  })

  return mcApi
}
