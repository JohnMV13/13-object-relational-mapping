'use strict';
import express from 'express';
const router = express.Router();

export default router;

import Paths from '../models/paths';

import cowsay from 'cowsay';

router.post('/500', (req, res) => {
  throw new Error('Test Error');
});
router.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});
router.get('/cowsay', (req, res) =>{
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowsay.say({text: req.query.text})}</pre></body></html>`);
});
router.get('/api/cowsay', (req, res) =>{
  json(res, {
    content: cowsay.say(req.query),
  });
});
router.get('/api/v1/paths', (req,res) =>{
  return Paths.find()
    .then(paths => {
      res.json(paths);
    });
});
router.get('/api/v1/paths/:_id', (req,res) =>{
  return Paths.findById(req.params._id)
    .then(paths => {
      res.json(paths);
    });
});
router.post('/api/cowsay', (req, res) => {
  json(res, {
    message: `Hello, ${req.body.name}!`,
  });
});
router.post('/api/v1/paths', (req, res) =>{
  if (!req.body || !req.body.name || !req.body.family || !req.body.retailer) {
    res.send(400);
    res.end();
    return;
  }
  var newPath = new Paths({...req.body});
  newPath.save()
    .then(saved=>{
      res.json(saved);
    });
});
router.put('/api/v1/paths/:_id', (req,res)=>{
  return Paths.findById(req.params._id)
    .then(paths =>{
      paths.name = req.body.name;
      paths.family = req.body.family;
      paths.retailer = req.body.retailer;
      res.json(paths);
      res.end();
      return;
    });
});
router.delete('/api/v1/paths/:_id', (req,res)=>{
  res.json({
    message: `ID ${req.params._id} was deleted`,
  });
});

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

  
function json(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}
