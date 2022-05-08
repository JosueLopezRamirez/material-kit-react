import axios from "axios";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return "";
};

const instanciaAxios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    authorization: getToken(),
  },
});

export default instanciaAxios;
