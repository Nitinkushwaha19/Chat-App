import axios from "axios";

const API = axios.create({baseURL: 'http://localhost:3000/'});

const addMessage = (data) =>  API.post(`/message`,data);

export default addMessage;