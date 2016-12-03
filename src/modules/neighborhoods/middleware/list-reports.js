/**
 * @module redtail/modules/neighborhoods/middleware/listReports
 */

/**
 * Generate and list Neighborhood reports. Reports include aggregate data
 * about relationships between Neighborhoods, Establishments, and Rodents.
 * @param {Model} model The Neighborhood model.
 * @param {Sequelize} sequelize Initialized sequelize instance.
 * @returns {function} Middleware function.
 */
function listReports(model, sequelize) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'listReports', model_name: model.modelName })
    const options = req.ctx.getQueryOptions()

    if (logger.debug()) {
      logger.debug({ filter: options }, 'generating query to list all reports')
    }

    /*
     * This raw query is not ideal, but could not get the Sequelize ORM to
     * produce an efficient query. My goal is to try to do as much sorting
     * and filtering in the data tier as possible, where results can be cached,
     * and limited data sent back to the client.
     *
     * In a production-bound application, this might be implemented as a
     * view; however, for the purposes of this application, it is a raw query.
     *
     * Parameters should still be sanitized through Sequelize, _except_ for
     * sort, which is rendered directly in the string. However, the sort
     * middleware does validation that valid fields and directions are loaded,
     * so data should be safe by the time it hits here (as long as it was
     * validated through the appropriate middleware).
     */
    sequelize.query(`select \`Neighborhood\`.*,
        count(distinct \`Rodent\`.\`id\`) as \`num_rodents\`,
        count(distinct \`Establishment\`.\`id\`) as \`num_establishments\`
      from \`neighborhoods\` as \`Neighborhood\`
      left join \`rodents\` as \`Rodent\`
        on \`Neighborhood\`.\`id\` = \`Rodent\`.\`neighborhood_id\`
      left join \`establishments\` as \`Establishment\`
        on \`Neighborhood\`.\`id\` = \`Establishment\`.\`neighborhood_id\`
      where \`Neighborhood\`.\`name\` like :name
      group by \`Neighborhood\`.\`id\`
      order by ${options.order && options.order.length ? options.order.map(params => params.join(' ')).join(',') : 1}
      limit :offset,:limit;`, {
        model,
        replacements: {
          name: options.where && options.where.name && options.where.name.like ? options.where.name.like : '%',
          limit: options.limit || 10,
          offset: options.offset || 0
        }
      })
      .then(instances => instances.map(instance => instance.get()))
      .then((results) => {
        if (logger.debug()) {
          logger.debug({ count: results.length }, 'found %s results matching the filter',
            results.length)
        }

        req.ctx.status = 200
        req.ctx.result = results
        next()
      })
      .catch(next)
  }
}

export default listReports
