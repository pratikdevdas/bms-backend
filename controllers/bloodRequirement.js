const bloodDonorRouter = require('express').Router()
const Require = require('`../models/bloodRequire')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const path = require('path')
const validator = require('email-validator')

bloodDonorRouter.get('/', async (request, response) => {
  const require = await Require.find({})
  response.json(require)
})

bloodDonorRouter.post('/', (request, response) => {
  const body = request.body
  const require = new Require({ ...body })
  const pocEmail = body.email

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  let MailGenerator = new Mailgen({
    theme: {
      path: path.resolve('theme.html'),
    },
    product: {
      name: 'Icamp',
      link: 'https://www.instagram.com/ecell_kiit/',
      company: body.name
    },
  })

  let mail = MailGenerator.generate({ body:{} })

  let message = {
    from: process.env.EMAIL_USER,
    to: pocEmail,
    subject: 'Thank You for posting your blood',
    html: mail,
  }

  if (!body.name || !body.website ) {
    return response.status(400).json({
      error: 'name or website missing'
    })
  }

  // email validator
  if(!validator.validate(body.email)){
    return response.status(400).json({
      error: 'Wrong  email'
    })
  }

  require
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
  const require = await Require.findById(request.params.id)
  if (require) {
    response.json(require)
  } else {
    response.status(404).end()
  }
})

module.exports = bloodDonorRouter
