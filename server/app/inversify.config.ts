import { DataBaseService } from './services/database.service';

import {Container} from 'inversify';
import {Application} from './app';
import {IndexController} from './controllers/index.controller';
import {Server} from './server';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.DataBaseService).to(DataBaseService);

export {container};
