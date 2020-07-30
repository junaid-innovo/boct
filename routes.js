const routes = require('next-routes');

module.exports = routes().add({
  name: 'homeRoute',
  pattern: '/',
  page: 'homePage'
});