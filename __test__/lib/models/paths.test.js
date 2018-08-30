'use strict';
import Paths from '../../../src/models/paths';
const mongoConnect = require('../../../src/util/mongo');
const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://localhost/401-2018-paths';
describe('instrument model', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });
  it('can save a Instrument', () => {
    let instrument = new Paths({
      name: 'Test Instrument',
      family: 'Something',
    });
    return instrument.save()
      .then(saved => {
        expect(saved.name).toBe('Test Instrument');
        expect(saved.family).toEqual(instrument.family);
      });
  });
  it('fails if title is missing', () => {
    let instrument = new Paths({
      created: new Date(),
    });
    return expect(instrument.save())
      .rejects.toBeDefined();
  });
  // TODO: test Instrument.find()
  it('can find an instrument', ()=>{
    console.log(Paths.find({}));
     
  });
});