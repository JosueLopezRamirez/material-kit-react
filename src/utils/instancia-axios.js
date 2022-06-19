import axios from "axios";

const instanciaAxios = axios.create({
  baseURL: "http://localhost:5000",
});

export default instanciaAxios;
