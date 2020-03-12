import {NextFunction, Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import Types from '../types';
import { Drawing } from './../../../common/communication/drawing';
import { DataBaseService } from './../services/database.service';

@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(Types.DataBaseService)  private dataBaseService: DataBaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/saveDrawing', (req: Request, res: Response, next: NextFunction) => {
           const drawing: Drawing = req.body;
           if (drawing.name  === 'null' || drawing.tags[0] === '') {
               res.status(400);
               res.send('Missing name or tags');
            } else {
                this.dataBaseService.saveDrawing(drawing);
                res.status(204);
                res.send('The drawing has been saved');
            }
        });

        this.router.get('/getDrawings', async (req: Request, res: Response) => {
            const allDrawings = await this.dataBaseService.getDrawings();
            res.send(allDrawings);
        });

        this.router.get('/deleteDrawing/:drawingID', async (req: Request, res: Response) => {
            const drawingId = req.params.drawingID;
            const isDeleted = await this.dataBaseService.deleteDrawing(drawingId);
            res.send(isDeleted);
        });
    }
}
