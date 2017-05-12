import express from 'express';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const devPort = 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());

import mongoose from 'mongoose';
import session from 'express-session';

console.log(process.env.NODE_ENV);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open',()=>{ console.log('Connected to mongoDb server') });

mongoose.connect('mongodb://bluestone:hasunoong1@ds157987.mlab.com:57987/note-pad');

app.use(session({
    secret: 'CodeLab1$1$1234',
    resave: false,
    saveUninitialized: true
}));
app.use('/', express.static(path.join(__dirname, './../public')));


import api from './routes';
app.use('/api',api);

app.listen(port,()=>{
    console.log(`Express server is listening on port ${port}`);
});

if(process.env.NODE_ENV === 'development'){
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler,config.devServer);
    devServer.listen(
        devPort, () => {
            console.log(`webpack-dev-server is listening on port ${devPort}`);
        }
    )
}