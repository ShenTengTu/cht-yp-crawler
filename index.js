const {crawl}  = require('./src/index.js');

crawl({keyword:'保險',area:'新北市',page:0}).then(function(err) {
  console.log(err?err:'xlsx done.')
});
