const dotenv = require("dotenv")
const path = require("path");
module.exports = {
  getEnvConfig(str = 'dev') {
    let readPath = path.join(__dirname, '../.env.development')
    if (str === 'prod') {
      readPath = path.join(__dirname, '../.env.production')
    }
    const envConfig = dotenv.config({path: readPath})
    return envConfig.parsed || null
  }
}