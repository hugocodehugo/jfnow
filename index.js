'use strict';

/**
 * jfnow - returns the current date and time
 */

function jfnow() {
  return new Date();
}

function jfnowFormatted(options) {
  const now = jfnow();
  const opts = Object.assign(
    { dateStyle: 'full', timeStyle: 'long' },
    options
  );
  return now.toLocaleString(undefined, opts);
}

module.exports = { jfnow, jfnowFormatted };

if (require.main === module) {
  console.log(jfnowFormatted());
}
