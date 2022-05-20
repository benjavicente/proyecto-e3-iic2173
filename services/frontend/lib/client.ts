import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";

export const client = axios.create({ baseURL: "/" });
Session.addAxiosInterceptors(client);
