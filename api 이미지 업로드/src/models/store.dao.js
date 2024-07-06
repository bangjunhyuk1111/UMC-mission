import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import pool from '../../config/db.js';

const getPreviewReview = async (cursorId, size, storeId) => {
  let conn;
  try {
    conn = await pool.getConnection();

    if (cursorId === undefined || cursorId === null) {
      const [reviews] = await pool.query(getReviewByReviewIdAtFirst, [parseInt(storeId), parseInt(size)]);
      return reviews;
    } else {
      const [reviews] = await pool.query(getReviewByReviewId, [parseInt(storeId), parseInt(cursorId), parseInt(size)]);
      return reviews;
    }
  } catch (err) {
    console.error(err);
    throw new BaseError(status.DATABASE_ERROR); // 예상치 못한 데이터베이스 오류 처리
  } finally {
    if (conn) conn.release();
  }
};

export { getPreviewReview };
