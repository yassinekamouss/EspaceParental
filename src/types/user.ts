import { UserRole } from './userRole';

export interface User {

    id: string;
    firstName: string;
    lastName: string;
    gender:string;
    email: string;
    dateOfBirth: string;
    role: UserRole;

}
