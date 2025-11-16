import { body } from "express-validator";

export const userRegisterValidator = () => {
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min: 3})
        .withMessage("username must be 3 character long"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),
        body("FullName")
        .optional()
        .trim(),
    ]
}
