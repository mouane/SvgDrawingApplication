
import 'reflect-metadata';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Drawing } from './../../../common/communication/drawing';
import {expect} from 'chai';

describe('indexControllerTests', ()  => {
  const assert = require('assert'),
  http = require('http');
  chai.use(chaiHttp);

  it('should be able to get data', () => (done: any) => {
    http.get('http://localhost:3000/api/index/getDrawings',
    () => (res: {on: { (arg0: string, arg1: (chunk: any) => void): void; (arg0: string, arg1: () => void): void; }; } ) =>{
        let data: any;
        res.on('data', () => (drawingData: string) => {
          data = drawingData;
        });
        res.on('end', () => () => {
          assert.equal('[]', data);
          done();
        });
      });
  });

  it('it should post data as a Drawing format', async () => {
    const drawing: Drawing ={name: 'string',
      childList: ['test'],
      tags: ['test'],
      drawingImg: 'string',
      drawingColor: 'string',
      drawingHeight: 'string',
      drawingWidth: 'string',
      createdAt: 'string',}
    const res = await chai.request('http://localhost:3000/api/index').post('/saveDrawing').send(drawing);
    expect(res.status).to.be.equal(204);
  });

});
