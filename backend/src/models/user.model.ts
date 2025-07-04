import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [5, 'Minimum 5 letter word is required'],
      maxLength: [50, 'Cannot use more that 50 alphabets'],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minLength: [8, 'Provide atleast 8 digit password'],
      // Not return the password when the user is displayed
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_id: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String,
    subscription: {
      id: String,
      status: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // 10 represent the salt added to password before hasing it
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJwtToken: async function () {
    //@ts-ignore
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        name: this.name,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRY || '24h',
      }
    );
  },

  // comparing the user existing and given password
  comparePassword: async function (plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },

  // generating the forgot password token using crypto
  generatePasswordResetToken: async function () {
    // using the crypto to generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hashing the token using sha256
    this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // setting up the token expiry time
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min from now

    return resetToken;
  },
};

const User = model('User', userSchema);
export default User;
