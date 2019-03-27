module.exports = (app) => {
    require('./download')(app);
    require('./upload')(app);
};