const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  let message = err.message || "Something went wrong.";

  if (statusCode >= 500) {
    message = "We're having trouble connecting to the server. Please try again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
}; 

export default errorHandler ;