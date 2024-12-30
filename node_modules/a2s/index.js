if (require.main === module) {
  require('./bin/a2s')
} else {
  module.exports = require('./lib/a2s')
}
