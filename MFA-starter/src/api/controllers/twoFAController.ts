import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {User} from '@sharedTypes/DBTypes';
import {UserResponse} from '@sharedTypes/MessageTypes';
import fetchData from '../../utils/fetchData';
import OTPAuth from 'otpauth';
import twoFAModel from '../models/twoFAModel';
import QRCode from 'qrcode';

// TODO: Define setupTwoFA function
const setupTwoFA = async (
  req: Request<{}, {}, User>,
  res: Response<{qrCodeUrl: string}>,
  next: NextFunction,
) => {
  try {
    // TODO: Register user to AUTH API
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    };
    const userRespose = await fetchData<UserResponse>(
      process.env.AUTH_URL + '/api/v1/users',
      options,
    );

    console.log('userResponse', userRespose);

    // TODO: Generate a new 2FA secret
    const secret = new OTPAuth.Secret();

    // TODO: Create the TOTP instance
    const totp = new OTPAuth.TOTP({
      issuer: 'ElukkaAPI',
      label: userRespose.user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });

    // TODO: Store or update the 2FA data in the database
    await twoFAModel.create({
      email: userRespose.user.email,
      userId: userRespose.user.user_id,
      twoFactorEnabled: true,
      twoFactorSecret: secret.base32,
    });

    // TODO: Generate a QR code and send it in the response
    const imageUrl = await QRCode.toDataURL(totp.toString());

    res.json({qrCodeUrl: imageUrl});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// TODO: Define verifyTwoFA function
const verifyTwoFA = async (req: Request, res: Response, next: NextFunction) => {
  const {email, code} = req.body;
  console.log(email, code);

  try {
    // TODO: Retrieve 2FA data from the database
    // TODO: Validate the 2FA code
    // TODO: If valid, get the user from AUTH API
    // TODO: Create and return a JWT token
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {setupTwoFA, verifyTwoFA};
