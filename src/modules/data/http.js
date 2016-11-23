/**
 * @module redtail/modules/data/http
 */

import * as popsicle from 'popsicle'

/**
 * MIME type for JSON data.
 * @type {String}
 */
const CONTENT_TYPE_JSON = 'application/json'

/**
 * Retrieve JSON data from a remote HTTP service. Handles requesting JSON
 * data, and parsing the result into a Javascript object.
 * @param {Object} options The request options for making the HTTP request.
 *  Should match the format expected by the popsicle module.
 * @returns {any} The result of the HTTP call.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
async function getDataAsJSON(options) {
  if (!options.url) {
    throw new Error('Missing required option: `url`')
  }

  return popsicle.request(Object.assign({}, options, { headers: { accept: CONTENT_TYPE_JSON } }))
    .use(popsicle.plugins.parse(['json']))
    .then((response) => {
      if (response.status >= 400) {
        // TODO use custom error
        throw new Error(`Error retrieving data from remote: ${response.status}`)
      }
      return response.body
    })
}

export default popsicle
export { getDataAsJSON }