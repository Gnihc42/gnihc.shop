function not_found(res) {
    res.statusCode = 404;
    res.end('Not Found\n');
  };

module.exports = {not_found}