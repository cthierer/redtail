/**
 * hello-world: a simple module for testing the framework.
 * @module redtail/modules/hello-world
 */

/**
 * Generate a message addressing the specified subject.
 * @param {string} subject The person, place, or thing being addressed.
 * @returns {Promise <string>} Resolves to the generated message.
 */
async function getMessage(subject = 'world') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`hello, ${subject}`)
    })
  })
}

export default {
  getMessage
}
