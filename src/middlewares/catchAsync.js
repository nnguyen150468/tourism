const catchAsync = func => (req, res, next) => {
    return func(req, res, next).catch(err => next(err))
}

module.exports = catchAsync;