import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});

const userChats = (id) =>  API.get(`/chat/${id}`)
const postChats = (chat) => API.post(`/chat`,chat);

export default userChats;