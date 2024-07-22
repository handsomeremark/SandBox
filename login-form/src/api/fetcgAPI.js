import axios from "axios";
import { URL } from "../config/Config";

export const userEmail = async () => {
  const response = await axios.get(`${URL}/users`);
  console.log(response);
  return response.data;
};
