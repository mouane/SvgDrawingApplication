import * as Chai from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Drawing } from './../../../common/communication/drawing';
import { DataBaseService } from './database.service';
describe('mongoService tests', () => {
    let service: DataBaseService;
    const expect = Chai.expect;

    beforeEach(() => {
        service = new DataBaseService();
    });

    it('should be an object', () => {
        expect(service).to.be.an('object');
    });

    it('should save drawing to mongodb', async () => {
        const drawing: Drawing = {name:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        childList: ['test'],
        tags: ['test'],
        drawingImg: 'string',
        drawingColor: 'string',
        drawingHeight: 'string',
        drawingWidth: 'string',
        createdAt: 'string', };

        expect(async function() {
                    await service.saveDrawing(drawing);
                }).to.not.throw();

    });


});
