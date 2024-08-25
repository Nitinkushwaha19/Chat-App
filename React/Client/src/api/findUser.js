import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});
const findUser = (username) => API.get('/users', { params: { username } });

export default findUser;