import { Expose } from 'class-transformer';

export class ShowUserDTO {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdOn: Date;
}
