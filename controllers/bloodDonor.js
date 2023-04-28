const bloodDonorRouter = require('express').Router()
const Donate = require('../models/bloodDonate')
const nodemailer = require('nodemailer')
const validator = require('email-validator')

bloodDonorRouter.get('/', async (request, response) => {
  const donate = await Donate.find({})
  response.json(donate)
})

bloodDonorRouter.post('/', (request, response) => {
  const body = request.body
  const donate = new Donate({ ...body })

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  let message = {
    from: process.env.EMAIL_USER,
    to: body.email,
    subject: 'Your Blood has been submitted',
    text: `Dear ${body.name},\n\n Blood has been successfully submitted with a id of ${donate.id}. Thank you for supporting a life\n\nBest Regards,\nTech Team 1`,
  }

  // email validator
  if(!validator.validate(body.email)){
    return response.status(400).json({
      error: 'Wrong email'
    })
  }

  donate
    .save()
    .then(() => transporter.sendMail(message))
    .then(() => response.status(200).json({ success: 'successful' }))
    .catch((err) => {
      if(err.code === 11000){
        return response.status(400).json({
          error: 'Company or website already exists.'
        })
      }
      return  response.status(500).send(err)})
})

bloodDonorRouter.get('/:id', async (request, response) => {
  const donate = await Donate.findById(request.params.id)
  if (donate) {
    response.json(donate)
  } else {
    response.status(404).end()
  }
})

module.exports = bloodDonorRouter
