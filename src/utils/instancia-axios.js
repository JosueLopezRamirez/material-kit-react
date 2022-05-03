import axios from "axios";

let token = "";

if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

const instanciaAxios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    authorization: token,
  },
});

export default instanciaAxios;
