import axios from "axios";

const backend_axios = axios.create({
  baseURL: "https://kyledenief.me/api"
})

export default backend_axios;