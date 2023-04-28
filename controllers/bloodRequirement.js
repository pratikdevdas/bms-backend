const bloodDonorRouter = require('express').Router()
const Require = require('../models/bloodRequire')
const Donate = require('../models/bloodDonate')
const nodemailer = require('nodemailer')
// const Mailgen = require('mailgen')
// const path = require('path')
// const validator = require('email-validator')

bloodDonorRouter.get('/', async (request, response) => {
  const require = await Require.find({})
  response.json(require)
})

bloodDonorRouter.post('/', async(request, response) => {
  const body = request.body
  const require = new Require({ ...body })
  const donate = await Donate.find({ group:body.group })

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })



  console.log(donate.length)
  if(donate.length !== 0){
    let message = {
      from: process.env.EMAIL_USER,
      to: body.email,
      subject: 'Your Blood is available',
      text: `Dear ${body.name},\n\nYour blood request is available. Kindly contact ${donate[0].name} with number ${donate[0].phone} for your blood.\n\nBest Regards,\nTech Team,\nTeam 1`,
    }
    await transporter.sendMail(message)
    return response.status(200).json({ success:'Your blood is already available. Kindly check FIND BLOOD. Also, we have again sent contact details over your mail.' })
  }

  await require
    .save()
    .then(() => response.status(200).json({ success: 'Successfully saved your requirement.' }))
    .catch((err) => {
      if(err.code === 11000){
        return response.status(400).json({
          error: 'Company or website already exists.'
        })
      }
      return  response.status(500).send(err)})
})

bloodDonorRouter.get('/:id', async (request, response) => {
  const require = await Require.findById(request.params.id)
  if (require) {
    response.json(require)
  } else {
    response.status(404).end()
  }
})

module.exports = bloodDonorRouter
