import { injectable } from 'inversify';
import { Collection, Db, MongoClient, MongoError, ObjectID } from 'mongodb';
import { Drawing } from './../../../common/communication/drawing';
const uri = 'mongodb+srv://admin:admin@projet2-3qric.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'Project2';
const collectionName = 'drawings';
@injectable()
export class DataBaseService {
      getDrawings(): Promise<Drawing[]> {
        return new Promise<Drawing[]>( (resolve: (value?: Drawing[] | PromiseLike<Drawing[]> | undefined) => void,
                                        reject: (reason?: MongoError) => void) =>
            MongoClient.connect(uri, {useNewUrlParser : true},  (connectError: MongoError, client: MongoClient) => {
                const db: Db = client.db(dbName);
                const drawings: Collection<Drawing> = db.collection(collectionName);
                drawings.find({}).toArray((findError: MongoError, drawingsFound: Drawing[]) => {
                    if (findError) {
                        reject(findError);
                        throw findError;
                    }
                    resolve(drawingsFound);
                });
                if (connectError) {
                    throw connectError;
                }
                client.close();
            }),
        );

    }

    saveDrawing(drawing: Drawing): void {
        MongoClient.connect(uri, {useNewUrlParser : true}, (connectError: MongoError, client: MongoClient) => {
            const db: Db = client.db(dbName);
            const drawings: Collection<Drawing> = db.collection(collectionName);
            drawings.insertOne(drawing, (error: MongoError) => {
                if (error) {
                    throw error;
                }
            });
            if (connectError) {
                throw connectError;
            }
            client.close();
        });
    }

      deleteDrawing(drawingIdToDelete: string): void {
        MongoClient.connect(uri, {useNewUrlParser : true}, (connectError: MongoError, client: MongoClient) => {
            const db: Db = client.db(dbName);
            const drawings: Collection<Drawing> = db.collection(collectionName);
            drawings.deleteOne({_id: new ObjectID(drawingIdToDelete)});
            });
    }
}
