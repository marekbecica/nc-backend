import { Request } from 'express';

export interface AuthRequest extends Request {
    user: {
      uid: string;
      phoneNumber: string;
    };
    body: UpdateProfileDTO;
}

export interface UserProfile {
    phoneNumber: string;
    name: string;
    email: string;
    updatedAt: Date;
    createdAt: Date;
}
  
export interface UpdateProfileDTO {
    name: string;
    email: string;
}