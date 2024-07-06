import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql';

import { userRouter } from './src/routes/user.route.js';
import { tempRouter } from './src/routes/temp.route.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';
import { response } from './config/response.js';
import { storeRouter } from './src/routes/store.route.js';

import { specs } from './swagger/swagger.config.js';
import SwaggerUi from 'swagger-ui-express';
dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));

app.use('/user', userRouter);
app.use('/temp', tempRouter);
app.use('/:storeId', storeRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    // 템플릿 엔진 변수 설정
    res.locals.message = err.message || 'Internal Server Error';
    // 개발 환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {}; 

    // 기본적으로 500 상태 코드를 사용하도록 설정
    const statusCode = err.status || status.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(response(err));
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
});

