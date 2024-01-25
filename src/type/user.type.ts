export type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  update_at: Date;
  create_at: Date;
  password?: string;
  type?: string;
};
