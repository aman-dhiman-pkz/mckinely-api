// ensure to load .env into process.env
if (require('dotenv').config().error) {
    throw new Error('Cannot load .env file to process env!');
}