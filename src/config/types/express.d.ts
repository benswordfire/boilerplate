import { User } from '../../modules/authentication/types/User';

declare global {
  namespace Express {
	interface Request {
	  user?: User;
	}
  }
}