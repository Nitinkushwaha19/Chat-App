import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});

const postChats = (chat) => API.post(`/chat`,chat);

export default postChats;