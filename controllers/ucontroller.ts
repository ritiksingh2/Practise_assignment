import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import UserModel, { UserInterface } from '../models/userModel';
import { generateToken, generateRefreshToken } from '../services/tokenGeneration';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find({}).select('-password');
  res.status(200).json({ success: true, count: users.length, users });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (await user.passwordCheck(password)) {
    res.status(200).json({
      
      user: {
        id: user._id,
        firstName :user.firstName,
        lastName: user.lastName,
        email: user.email,
        role:user.role,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(),
      },success_message: true,
    });
  } else {
    res.status(401);
    throw new Error('Email or password incorrect');
  }
});


// export const getProfile = async (req: Request, res: Response) => {
//     try {
//       const userId = req.UserModel.id; 

//       const user: UserInterface | null = await UserModel.findById(userId).select('-password');
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
 
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };



export const editUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id, firstName, lastName, email } = req.body;
  const loggedInUser = req.body as UserInterface;

  try {

    if (loggedInUser.role === '1') {
   
      const userToEdit = await UserModel.findById(id);

      if (!userToEdit) {
         res.status(404).json({ message: 'User not found' });
         return;
      }

      userToEdit.firstName = firstName;
      userToEdit.lastName = lastName;
      userToEdit.email = email;
      await userToEdit.save();

       res.status(200).json({ message: 'User profile updated successfully' });
       return;
    } else if (loggedInUser.role === '0') {
    
      if (loggedInUser._id.toString() === id) {
        loggedInUser.firstName = firstName;
        loggedInUser.lastName = lastName;
        loggedInUser.email = email;

        await loggedInUser.save();

         res.status(200).json({ message: 'User profile updated successfully' });
         return;
      } else {
         res.status(403).json({ message: 'You are not authorized to edit this profile' });
         return;
      }
    } else {
       res.status(401).json({ message: 'Unauthorized' });
       return
    }
  } catch (error) {
    console.error('Error while editing user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, firstName,lastName,role, password } = req.body;
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const pwdExp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/i;
    const result: boolean = expression.test(email);
    const resultPwd: boolean = pwdExp.test(password);
    const check = await UserModel.findOne({email});

    if(!check){
        if(result){
            if(resultPwd){
        const t = generateRefreshToken();
        const user = new UserModel({
            email, firstName,lastName,role, password, t
        });
        await user.save();

        res.status(201).json({  user: {
            
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id),
            role:user.role,
            refreshToken : user.refreshToken
        } ,success_of_request: true,});
        }
        else{
            res.json({
                message : "Choose stronger password it should be atleast 8 words with one capital and one special character"
            })
        }
        }else{
            res.json({
                message : "Invalid email"
            })
        }
    }else{
        res.json({
            message : "User already exists",
            advice: "please login...."
        })
    }

})
export const refreshTokenHandler = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const user = await UserModel.findOne({ refreshToken });
  const userId = user?._id;

  if (user) {
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        token: generateToken(userId),
        refreshToken: generateRefreshToken(),
      },
    },{ new: true });
    const updatedUser = await UserModel.findById(userId);
    if (updatedUser) {
    res.status(200).json({
      message: 'Access token refreshed!',
      refresh_new:updatedUser.refreshToken,
      firstName:updatedUser.firstName,
      lastName:updatedUser.lastName,
      token_new:updatedUser.token
    });
  }}
  else {
    res.json({
      message: 'Incorrect refresh token',
    });
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (await user.passwordCheck(password)) {
     user.deleteOne();
    res.json({
      message: 'User deleted',
    });
  } else {
    res.status(401);
    throw new Error('Password not correct');
  }
});
