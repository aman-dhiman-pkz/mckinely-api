module.exports = (app) => {
    require('./status')(app);
    require('./product')(app);
    require('./file')(app);
};