type Chat = {
  other_user_id: string;
  last_at: string;
};

type Message = {
  id: number;
  from_user_id: string;
  created_at: string;
  message: string;
};

type PrivateMessage = Message & {
  to_user_id: string;
};

type User = {
  email: string,
  token: string,
}

type IdChat = {
  id: string,
}