import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});

const getUser = (id) =>  API.get(`/users/${id}`)

export default getUser;