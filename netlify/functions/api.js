const serverless = require('serverless-http');
const app = require('../../app');

const handler = serverless(app);

// Netlify may rewrite /api/x to the function with either the original
// path or the path without the /api prefix (depending on the redirect's
// :splat). Normalize so Express routes registered under /api always match.
module.exports.handler = async (event, context) => {
  const e = { ...event };
  if (!e.path.startsWith('/api')) {
    e.path = '/api' + e.path;
  }
  return handler(e, context);
};