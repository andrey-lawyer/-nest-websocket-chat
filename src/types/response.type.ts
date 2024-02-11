import { Member } from 'src/member/member.entity';

export interface IRegisterResponse {
  message: string;
  member: {
    name: string;
    email: string;
    avatar: string;
  };
}

export interface IResponseMember {
  id: number;
  name: string;
  email: string;
}

export class ITokenUser extends Member {
  token: string;
}
