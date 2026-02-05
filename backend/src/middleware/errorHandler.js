export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.message
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: 'A record with this value already exists'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Reference error',
      details: 'Referenced record does not exist'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};
