const generateToken = (user, statusCode, message, res) => {
    let token = user.generateJsonWebToken();
    let cookieName = user.role == "Patient" ? "patientToken" :  "dashboardToken";  //"Admin","Patient","Doctor"

    return res.status(statusCode).cookie(cookieName, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).json({success: true,
        message,
        user,
        token
    })
};

export default generateToken;