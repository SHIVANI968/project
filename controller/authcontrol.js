const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modules/user');

const register = async (user) => {
    console.log('Registering user:', user);
    try{
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return {
             message: 'User is already registered, please login',
             statuscode: 400
          };
        }

       //Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      //Create a new user
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword
      });

      return { 
        message: 'User registered successfully', 
        statuscode: 200 
      };
   }catch(error){ 
        console.error('Error during user registration:', error);
        return {
            message: 'Registration failed, please try again later',
            statuscode: 500
        };
   }
};

//login function
const login = async (user) => {
    const { email, password } = user;
    if (!email || !password) {
        return { message: 'Email and password are required', statuscode: 400 };
    }
    try {
        // 1. Check if user exists
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return { message: 'User not found, please register first', statuscode: 404 };
        }

        // 2. Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return { message: 'Invalid credentials', statuscode: 401 };
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET || "mysecretkey", // put JWT_SECRET in .env
            { expiresIn: "1h" }
        );

        return {
            message: 'Login successful',
            statuscode: 200,
            token
        };
    } catch (error) {
        console.error('Error during login:', error);
        return { message: 'Login failed, please try again later', statuscode: 500 };
    }
};

//password reset function
const resetPassword = async (data) => {
    const { email, oldPassword, newPassword } = data;
    if (!email || !oldPassword || !newPassword) {
        return { message: 'Email, old password, and new password are required', statuscode: 400 };
    }
    try {
        // 1. Find user by email
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return { message: 'User not found', statuscode: 404 };
        }

        // 2. Compare old password with stored hash
        const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isMatch) {
            return { message: 'Old password is incorrect', statuscode: 401 };
        }

        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Save updated password
        existingUser.password = hashedPassword;
        await existingUser.save();

        return { message: 'Password updated successfully', statuscode: 200 };
    } catch (error) {
        console.error('Error during password reset:', error);
        return { message: 'Password reset failed, try again later', statuscode: 500 };
    }
};

module.exports = {
    register,
    login,
    resetPassword
};
    