// Express-এর কেন্দ্রীয় Error Middleware
export function errorMiddleware(
  error,
  req,
  res,
  next
) {
  console.error('Server error:', {
    method: req.method,
    path: req.path,
    message: error.message,
    time: new Date().toISOString()
  });

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : 500;

  const message =
    statusCode >= 500
      ? 'সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।'
      : error.message || 'অনুরোধটি সম্পন্ন করা যায়নি';

  return res.status(statusCode).json({
    success: false,
    message
  });
}