import { User} from './user';
import { Student } from './student';

export interface Parent extends User {

    children: Student[];
    role: 'parent';
}
