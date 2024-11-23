export interface User {
  id?: number;
  name: string;
}

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
}
