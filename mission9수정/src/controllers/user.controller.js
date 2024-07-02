// controllers/user.controller.js

import { addUser } from "../models/user.dao.js";
import { status } from "../../config/response.status.js";

export const userSignin = async (req, res) => {
    try {
        const userId = await addUser(req.body);

        if (userId === -1) {
            return res.status(400).json({
                status: 400,
                isSuccess: false,
                code: "COMMON001",
                message: "이미 존재하는 이메일입니다"
            });
        }

        return res.status(200).json({
            status: 200,
            isSuccess: true,
            code: 2000,
            message: "success!",
            data: {
                userId: userId,
                email: req.body.email,
                name: req.body.name,
                prefer: req.body.prefer
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            isSuccess: false,
            code: "COMMON000",
            message: "서버 에러, 관리자에게 문의 바랍니다."
        });
    }
};
