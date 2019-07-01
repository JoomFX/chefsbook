import { Expose } from 'class-transformer';

export class ShowUserDTO {

  // Should we expose the ID ???
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  friends?: ShowUserDTO[];

  @Expose()
  createdOn: Date;
}
