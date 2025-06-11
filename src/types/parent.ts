import { User } from './user';
import { UserRole } from './userRole';

export interface Parent extends User {

    children: string[];
    role: UserRole.PARENT;
}
