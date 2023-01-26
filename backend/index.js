const cors = require('cors')
const express = require('express');
const app = express();
const port = 3000;
const tickets = require('./services/tickets');
const {body, param, validationResult} = require('express-validator')

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors())

/* GET tickets */
app.get('/tickets', async function(req, res, next) {
  try {
    res.json(await tickets.getTickets());
  } catch (err) {
    console.error('Error while getting tickets');
    next(err);
  }
});

/* GET ticket */
app.get('/ticket/:ticketId',
  param('ticketId').trim().isInt(),
  async function(req, res, next) {
    try {
      validationResult(req).throw();
      res.json(await tickets.getTicket(req.params.ticketId));
    } catch (err) {
      console.error('Error while getting ticket');
      next(err);
    }
});

/* POST user */
app.post('/user',
  body('username').trim().isLength({min: 1, max: 255}).isAlphanumeric().escape(),
  async function(req, res, next) {
    try {
      validationResult(req).throw();
      res.json(await tickets.addUser(req.body.username));
    } catch (err) {
      console.error('Error while posting username');
      next(err);
    }
});

/* POST ticket */
app.post('/ticket', 
  body('title').trim().isLength({min: 1, max: 255}).escape(),
  body('description').trim().isLength({min: 1, max: 1000}).escape(),
  body('userId').isInt().trim(),
  async function(req, res, next) {
    try {
      validationResult(req).throw();
      res.json(await tickets.addTicket(req.body));
    } catch (err) {
      console.error('Error while posting ticket');
      next(err);
    }
});

/* POST comment */
app.post('/ticket/:ticketId',
  body('text').trim().isLength({min: 1, max: 1000}).escape(),
  body('userId').trim().isInt(),
  param('ticketId').trim().isInt(),
  async function(req, res, next) {
    try {
      validationResult(req).throw();
      res.json(await tickets.addComment(req.body, req.params.ticketId));
    } catch (err) {
      console.error('Error while posting comment');
      next(err);
    }
});

/* DELETE ticket */
app.delete('/ticket/:ticketId',
  body('userId').trim().isInt(),
  param('ticketId').trim().isInt(),
  async function(req, res, next) {
    try {
      validationResult(req).throw();
      res.json(await tickets.deleteTicket(req.body.userId, req.params.ticketId));
    } catch (err) {
      console.error('Error while deleting ticket');
      next(err);
    }
});

/* Error handler middleware */
app.use((err, req, res, next) => {
  console.error(err.message, err.stack);
  if (err.mapped) {
    res.status(400).json(err.mapped());
    return;
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(err.message);
});

app.listen(port, () => {
  console.log('Example app listening at http://localhost:${port}');
});
