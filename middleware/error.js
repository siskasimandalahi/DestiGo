const loggingMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };

const errorMiddleware = (err, req, res, next) => {
    
    const statusCode = 500;
    res.status(statusCode).json({ message: err.message})

  };

  module.exports = { errorMiddleware,loggingMiddleware}    