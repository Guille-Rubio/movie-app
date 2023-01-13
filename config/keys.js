if (process.env.NODE_ENV === 'production') {

    module.exports = require('./prod');
    console.log("production environment")

} else if (process.env.NODE_ENV === 'development') {

    module.exports = require('./dev');
    console.log("development environment")


}