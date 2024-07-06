// models/user.sql.js

export const insertUserSql = `
  INSERT INTO user (email, name, gender, birthYear, birthMonth, birthDay, addr, specAddr, phone)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const confirmEmail = `
  SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail
`;

export const insertUserPreferSql = `
  INSERT INTO user_prefer (user_id, prefer_id) VALUES (?, ?)
`;
