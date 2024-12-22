const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = 'https://api.lomadee.com';
  
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {'^/api': '/v3'},
    headers: {
      'Origin': 'https://api.lomadee.com'
    }
  })(req, res);
};
