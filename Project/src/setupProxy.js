const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA dev proxy: проксируем фронтовые запросы на /api -> backend http://localhost:3001
// При этом удаляем префикс /api в запросе к бэкенду (pathRewrite)
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
      },
      logLevel: 'silent',
    })
  );
};


