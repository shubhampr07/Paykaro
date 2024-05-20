const express = require("express");
const zod = require("zod")
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")

const router = express.Router();
dotenv.config();

//User-signUp-register

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

router.post("/signup", async (req, res) => {
    try {
        const result = signupBody.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Incorrect Details"
            });
        }

        const { username, firstName, lastName, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            firstName,
            lastName,
            password: hashedPassword,
        });

        const userId = newUser._id;

        // Create bank account
        await Account.create({
            userId,
            balance: Math.floor(Math.random() * 10000),
        });

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Add token expiration time
        );

        return res.status(201).json({
            message: "User Created Successfully",
            token: token,
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
//user sign-in-login

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/signin", async (req, res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success) {
        return res.status(409).json({
            message: "Incorrect Credentials"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
    });

    if(!user) {
        return res.status(401).json("User not exist.")
    }

    if(user) {
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch) {
            return res.status(401).json("Incorrect Password.")
        }
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET_KEY
        );
        res.status(200).json({
            token: token,
        });
        return;
    }
});


//updating userinfo

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        res.status(408).json({
            message: "Error while updating information.",
        });
    }

    await User.updateOne({_id: req.userId}, req.body);
    res.json({
        message: "Updated Successfully",
    });
});

//getting users with filter query

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            {
                firstName: {
                    $regex: filter,
                },
            },
            {
                lastName: {
                    $regex: filter,
                },
            },
        ],
    });

    res.json({
        user: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});


//for getting data of current logged in user data

router.get("/getUser", authMiddleware , async (req, res) => {
    const user = await User.findOne({
        _id: req.userId,
    });
    res.json(user);
});


router.post("/set-pin", authMiddleware, async (req, res) => {
    const { pin } = req.body;

    // Ensure pin is provided and valid (you can add more validation logic as needed)
    if (!pin || pin.length < 4) {
        return res.status(400).json({ message: "Invalid PIN. PIN must be at least 4 characters long." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.pin = pin;
        await user.save();

        res.json({ message: "PIN set successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;