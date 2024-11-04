export interface AuthRequest extends Request {
    user?: {
      uid: string;
      phoneNumber: string;
    };
}