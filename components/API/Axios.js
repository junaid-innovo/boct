import axios from "axios";
import {
  LOCAL_API_URL,
  IN_PRODUCTION_MODE,
  PRODUCTION_API_URL,
  CURRENT_ENVIREMENT,
  IN_STAGGING_MODE,
  STAGGING_API_URL,
} from "../Constants/Enviroment/Enviroment";
const Axios = axios.create({
  baseURL:
    //  CURRENT_ENVIREMENT === IN_PRODUCTION_MODE
    //    ? PRODUCTION_API_URL
    //    : CURRENT_ENVIREMENT === IN_STAGGING_MODE
    //    ? STAGGING_API_URL
    LOCAL_API_URL,
  timeout: 1000000,
});
export default Axios;
