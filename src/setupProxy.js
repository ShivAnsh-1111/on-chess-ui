const apiUrl = process.env.REACT_APP_BACKEND_URL;

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/chess-user",
        createProxyMiddleware({
            target: apiUrl,
            changeOrigin: true,
            secure: false
        })
    );
};
