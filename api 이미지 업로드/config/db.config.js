// 예시: db.config.js 파일
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectToDatabase() {
  let connection;
  try {
      // 데이터베이스 연결
      connection = await pool.getConnection();

      console.log('MySQL 연결 성공');

      // 데이터베이스 선택
      await connection.query(`USE umc7week`);

      console.log('데이터베이스 선택 완료:', 'umc7week');

      // 여기에 추가적인 로직을 넣으세요 (쿼리 실행 등)
  } catch (error) {
      console.error('MySQL 연결 오류:', error);
  } finally {
      if (connection) {
          // 연결 해제
          connection.release();
      }
  }
}

// 데이터베이스 연결 함수 호출
connectToDatabase();