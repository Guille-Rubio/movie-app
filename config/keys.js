if (process.env.NODE_ENV === 'Production') {

    module.exports = require('./prod');

} else {

    module.exports = require('./prod');
    //module.exports = require('./dev');

}