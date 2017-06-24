module.exports = {
    db:process.env.MONGOLAB_URI || process.env.MONGODB_URI  || 'mongodb://localhost/newshub',
    secret:'qwerasdfzxc'
}
