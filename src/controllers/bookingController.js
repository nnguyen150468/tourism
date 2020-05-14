const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const Tour = require('../models/tour')
const Booking = require('../models/booking')
const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.createBooking = catchAsync(async function(req, res,next){
    const {tourID} = req.params
    const tour = await Tour.findById(tourID)
    const {quantity, cc_number, cc_exp_month, cc_exp_year, cc_cvc} = req.body

    if(!quantity) return next(new AppError(400, "Booking needs a quantity"));

    if(tour.availability < quantity){
        return next(new AppError(400, "Your booking exceeds the available slots"))
    }

  // credit card token
  const cardToken = await stripe.tokens.create(
    {
      card: {
        number: cc_number,
        exp_month: cc_exp_month,
        exp_year: cc_exp_year,
        cvc: cc_cvc,
      },
    }
  );

      // make an api request to stripe and expect to receive a payment object.
    const payment = await stripe.charges.create(
    {
      amount: tour.price * quantity * 100,
      currency: 'usd',
      source: cardToken.id,
      description: `Payment from user ${req.user.name} for : Tour ${tour.title}`
    }
  );

    if(!payment.paid) return next(new AppError(400, "Something wrong during transaction"))

    const booking = await Booking.create({
        user: req.user._id,
        tour: tour._id,
        paymentID: payment.id,
        quantity: quantity,
        total: quantity * tour.price,
        paid: true
    })

    tour.availability = tour.availability - quantity;
    await tour.save()

    return res.status(201).json({
        status: "success",
        data: booking
    })
})