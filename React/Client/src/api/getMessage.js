import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});

const getMessages = (id) =>  API.get(`/message/${id}`)

export default getMessages;