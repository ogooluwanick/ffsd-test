import express from "express";
import expressAsyncHandler from "express-async-handler"
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from 'crypto';
import UsersResult from "../models/usersResult.js";
import { sendVerificationEmail } from "../utils/email.js";


const router = express.Router();

router.post("/signup", (async (req, res) => {
        const { email, password, firstName, lastName } = req.body;
        let stringemail = String(email)

        try {
                const oldUser = await UsersResult.findOne({ email });
                if (oldUser) return res.status(400).json({ message: "User already exists" });

                // Create verification token
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const verificationTokenExpiry = new Date();
                verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

                const hashedPassword = await bcrypt.hash(String(password), 8);
                const createUser = new UsersResult({
                        email: stringemail,
                        password: hashedPassword,
                        name: `${firstName} ${lastName}`,
                        verificationToken,
                        verificationTokenExpiry,
                        isVerified: false
                });


                const result = await createUser.save();


                // Send verification email
                await sendVerificationEmail(
                        result.email,
                        verificationToken
                );

                res.status(201).json({
                        message: "Registration successful. Please check your email to verify your account."
                });
        } catch (error) {
                console.log("sign up error:", error);
                res.status(500).json({ message: "Something went wrong" });
        }
}))

router.post("/signin", expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body;
        let passwordtoString = String(password)

        try {
                const oldUser = await UsersResult.findOne({ email });
                if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

                if (!oldUser.isVerified) {
                        return res.status(403).json({
                                message: "Please verify your email before logging in"
                        });
                }

                const checkPassword = await bcrypt.compare(passwordtoString, oldUser.password);

                if (!checkPassword) return res.status(400).json({ message: "Invalid credentials" });


                const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, "secret", { expiresIn: "3h" });
                res.status(200).json({ result: oldUser, token });
        } catch (err) {
                res.status(500).json({ message: "Something went wrong" });
        }
}))

router.post("/resend-verification-token", async (req, res) => {
        try {
                const { token } = req.body;
                const user = await UsersResult.findOne({
                        verificationToken: token,
                });
                        console.log("token",token,user)

                if (!user) {
                        return res.status(400).json({ message: "Invalid or expired verification token" });
                }

                const newVerificationToken = crypto.randomBytes(32).toString('hex');
                const newVerificationTokenExpiry = new Date();
                newVerificationTokenExpiry.setHours(newVerificationTokenExpiry.getHours() + 24);

                user.verificationToken = newVerificationToken;
                user.verificationTokenExpiry = newVerificationTokenExpiry;
                await user.save();

                await sendVerificationEmail(user.email, newVerificationToken);

                res.status(200).json({ message: "A new verification email has been sent to your email address." });
        } catch (error) {
                console.log("resend verification token error:", error);
                res.status(500).json({ message: "Something went wrong" });
        }
});

router.get("/verify-email/:token", async (req, res) => {
        try {
                const user = await UsersResult.findOne({
                        verificationToken: req.params.token,
                        verificationTokenExpiry: { $gt: new Date() }
                });

                if (!user) {
                        return res.status(400).json({
                                message: "Invalid or expired verification token"
                        });
                }

                user.isVerified = true;
                user.verificationToken = undefined;
                user.verificationTokenExpiry = undefined;
                await user.save();

                res.status(200).json({
                        message: "Email verified successfully. You can now login."
                });
        } catch (error) {
                res.status(500).json({ message: "Something went wrong" });
                console.log(error);
        }
});

export default router;
