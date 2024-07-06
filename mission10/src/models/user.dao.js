// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertUserSql, confirmEmail, insertUserPreferSql } from "./user.sql.js";

// User 데이터 삽입
export const addUser = async (data) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        console.log('DB 연결 성공');

        // 사용자 이메일 확인 쿼리 실행
        const [confirm] = await conn.query(confirmEmail, [data.email]);

        if (confirm[0].isExistEmail) {
            conn.release();
            return -1;  // 이미 존재하는 이메일인 경우
        }

        // 사용자 추가 쿼리 실행
        const [result] = await conn.query(insertUserSql, [
            data.email,
            data.name,
            data.gender,
            data.birthYear,
            data.birthMonth,
            data.birthDay,
            data.addr || null,
            data.specAddr || null,
            data.phone
        ]);

        const userId = result.insertId;
        console.log('User inserted with ID:', userId);

        // 선호 카테고리 추가
        for (const preferId of data.prefer) {
            console.log(`Inserting prefer_id ${preferId} for user_id ${userId}`);
            await conn.query(insertUserPreferSql, [userId, preferId]);
        }

        await conn.commit();
        console.log('Transaction committed successfully');
        return userId; // 새로 추가된 사용자의 ID 반환

    } catch (err) {
        if (conn) await conn.rollback();
        console.error('Error during user insertion:', err);  // 오류 로그 출력
        throw new BaseError({
            message: 'Failed to add user',
            status: status.PARAMETER_IS_WRONG,
            data: err
        });
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
};
