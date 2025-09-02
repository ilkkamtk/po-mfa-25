import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {User} from '@sharedTypes/DBTypes';
import {UserResponse} from '@sharedTypes/MessageTypes';
import fetchData from '../../utils/fetchData';
// TODO: Import necessary types and models

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
    // TODO: Create the TOTP instance
    // TODO: Store or update the 2FA data in the database
    // TODO: Generate a QR code and send it in the response
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
