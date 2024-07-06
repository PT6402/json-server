const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const queryString = require('query-string');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Rewrite default URL
// server.use(
//   jsonServer.rewriter({
//     '/api/v1/*': '/$1',
//   }),
// );

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === 'PUT') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

router.render = (req, res) => {
  const header = res.getHeaders();
  const totalCountHeader = header['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);
    const _page = Number.parseInt(queryParams._page) || 1;
    const _limit = Number.parseInt(queryParams._limit) || 10;
    const _totalRows = Number.parseInt(totalCountHeader);
    const _totalPages = Math.ceil(_totalRows / _limit);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: _page,
        _limit: _limit,
        _totalPages: _totalPages, // Add this line to include the total number of pages
      },
    };
    return res.jsonp(result);
  }
  res.jsonp(res.locals.data);
};

// Use default router
server.use('/api/v1', router);

server.listen(9090, () => {
  console.log('JSON Server is running on http://localhost:9090/api/v1');
});
