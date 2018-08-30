'use strict';

const request = require('supertest');

import app from '../src/app';
import Paths from '../src/models/paths';

const mongoConnect = require('../src/util/mongo');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/401-2018-paths';

describe('app', () => {
  beforeAll(()=>{
    return mongoConnect(MONGODB_URI);
  });

  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('responds with HTML for /', ()=>{
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text[0]).toBe('<');
      });
  });

  it('responds with HTML for /cowsay?text={message}', ()=>{
    return request(app)
      .get('/cowsay?text=hi')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text).toBeDefined();
        expect(response.text).toMatch('<html>');
        expect(response.text).toMatch(' hi ');
        expect(response.text).toMatch('</html>');
      });
  });

  it('responds with JSON for /api/cowsay?text={message}', ()=>{
    return request(app)
      .get('/api/cowsay?text=hi')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(response =>{
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch(' hi ');
      });
  });
  
  describe('api routes', () => {
    it('can PUT to /api/v1/paths', ()=>{
      var instrument = new Instrument({ name: 'Snare', family: 'Percussion', retailer: 'Yamaha' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .put(`/api/v1/paths/${saved._id}`)
            .send({ name: saved.name, class: saved.class, retailer: 'West Music'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(({ body }) => {
              expect(body).toBeDefined();
              expect(body.name).toBe(saved.name);
              expect(body.class).toBe(saved.class);
              expect(body.retailer).toBe('West Music');
            });
        });
    });
    it('can POST /api/v1/paths to create instrument', () => {
      return request(app)
        .post('/api/v1/instruments')
        .send({ name: 'Snare', family: 'Percussion', retailer: 'Yamaha' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body._id).toBeDefined();
          expect(response.body.name).toBe('Snare');
          expect(response.body.family).toBe('Percussion');
        });
    });
    it('can get /api/v1/paths/:id', () => {
      var instrument = new Paths({ name: 'Snare', family: 'Percussion', retailer: 'Yamaha' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .get(`/api/v1/paths/${saved._id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(response=>{
              expect(response.body).toBeDefined();
              expect(response.body._id).toBeDefined();
              expect(response.body.name).toBe('Snare');
            });
        });
    });
    it('can delete /api/notes/deleteme', () => {
      return request(app)
        .delete('/api/v1/paths/deleteme')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({ message: `ID deleteme was deleted` });
    });
  });
});