'use strict';

const {
  parseInput,
  auth,
  db,
  errorOf,
  UserError,
  isBlocked,
} = require('./utils');

exports.handler = async event => {
  try {
    const {
      appId,
      Authorization,
      ip,
    } = await parseInput(event, 'appId,Authorization,ip');

    const resBlocked = await auth(db, `apps/${appId}`, Authorization).
      then(() => isBlocked(db, `apps/${appId}`, ip));

    return {
      statusCode: 200,
      body: {
        message: resBlocked.toString(),
      },
    };
  } catch (err) {
    /* istanbul ignore else */
    if (err instanceof UserError) return errorOf(err.statusCode, err.message);
    /* istanbul ignore next */
    console.warn(err.message);
    /* istanbul ignore next */
    return errorOf(500, 'Internal Server Error');
  }
};