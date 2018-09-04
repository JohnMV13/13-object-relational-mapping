'use strict';

const request = require('supertest');

import app from '../src/app';
import Path from '../src/lib/models/paths';

const mongoConnect = require('../src/util/mongo-connect');
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
  
  describe('api routes', () => {
    it('can PUT to /api/v1/paths', ()=>{
      var path = new Path({ name: 'snare', family: 'percussion', retailer: 'Yamaha' });

      return path.save()
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
        .post('/api/v1/paths')
        .send({ name: 'snare', family: 'percussion', retailer: 'Yamaha' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body._id).toBeDefined();
          expect(response.body.name).toBe('snare');
          expect(response.body.family).toBe('percussion');
        });
    });
    it('can get /api/v1/paths/:id', () => {
      var path = new Path({ name: 'snare', family: 'percussion', retailer: 'Yamaha' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .get(`/api/v1/paths/${saved._id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(response=>{
              expect(response.body).toBeDefined();
              expect(response.body._id).toBeDefined();
              expect(response.body.name).toBe('snare');
            });
        });
    });
  });
  describe('DELETE', ()=>{
    let testInst;
    beforeEach(()=>{
      testInst = new Path({title: 'test', class: 'test'});
      return testInst.save()
        .then(()=>{
          return request(app)
            .delete(`/api/paths/${testInst._id}`)
            .expect(200)
            .expect({ message: `ID ${testInst._id} was deleted` });
        });
    });
  });
});