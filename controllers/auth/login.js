const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAgent } = require("../../utils/agent/agent");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const login = async (req, res, next) => {
    try {
        // Get the agent profile based on the username
        const profile = await getAgent({userName : req.body.userName});

        // If the profile doesn't exist, return an error
        if (!profile) {
            return res.status(404).json({ success: false, error: "Invalid User Name" });
        }

        // Compare the password using bcrypt
        const isPasswordValid = await bcrypt.compare(req.body.password, profile.password);

        // If the password is incorrect, return an error
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid Password" });
        }

        // Create a JWT token with the user's ID
        const token = jwt.sign({ userId: profile.id }, SECRET_KEY, { expiresIn: '10h' });

        //sanitize the agent profile
        profile.password = undefined;

        // Respond with the profile and the token
        return res.status(200).json({
            success: true,
            profile,
            token
        });

    } catch (error) {
        // Handle any errors that occur
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = login;
