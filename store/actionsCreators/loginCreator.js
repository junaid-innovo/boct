import axios from "../../components/API/Axios";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_OK } from "../../components/Constants/HTTP_STATUS/status";
import { LOGIN, GET_USER_COMPANIES } from "../actions/actionTypes";
import Cookies from "js-cookie";
export const get_login = (formData, language) => {
  let lang = language;
  return (dispatch) => {
    axios
      .post(`api/user/login`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      })
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          if (response.token) {
            let jwtString = jwt.decode(response.token);
            console.log("JWT string", jwtString);
            // let prefLang = jwtString.preferred_lang;
            // if (prefLang) {
            //   localStorage.setItem(LANGUAGE_STRING, prefLang);
            // }
            // let role = jwtString.role;
            let userName = jwtString.name[lang];
            localStorage.setItem("authtoken", response.token);
            localStorage.setItem("username", userName);
            Cookies.set("authtoken", response.token);
            // if (role.length === 0) {
            //   this.showMessage(ONLY_FOR_SUPERVISOR, "error");
            //   this.setState({
            //     loggedin: false,
            //     email: "",
            //     password: "",
            //     emailIsValid: false,
            //     passIsValid: false,
            //     pageloading: false,
            //   });
            // } else {
            //   localStorage.setItem("authtoken", response.token);
            //   localStorage.setItem("username", userName);
            //   this.setState({ loggedin: true, pageloading: false });
            //   this.props.loggedin(true);
            // }
            dispatch({
              type: LOGIN,
              payload: { loginStatus: true, message: response.message },
            });
          }
        } else {
          if (parseInt(response.code) === 401) {
            // this.setState({
            //   pageloading: false,
            // });
            // this.showMessage(response.message, "error");
          }
          dispatch({
            type: LOGIN,
            payload: { loginStatus: false, message: response.message },
          });
        }
      })
      .catch((error) => console.log(error));
  };
};

// axios
//   .get("2020-03-10/warehouses")
//   .then((response) => {
//     let resp = response.data;
//     if (resp.code === HTTP_STATUS_OK) {
//       dispatch(saveDefaultResult(resp.data));
//     }
//   })
//   .catch((error) => {
//     console.log("ERROR", error);
//   });

export const get_logout = () => {};
// export const saveDefaultResult = (res) => {
//   return {
//     type: GET_DEFAULT,
//     result: res,
//   };
// };

export const get_companies = (data) => {
  return (dispatch) => {
    axios
      .post(`api/user/companies`, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization":
            "tGd6Y5JOeuO0yx2GzUOG1eHqAM79C0jlvte2Th5tLLVNtmVNLxONQ2NGnVRNVU8N",
        },
      })
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          let data = response.data;
          dispatch({
            type: GET_USER_COMPANIES,
            payload: {
              companiesList: data,
              message: response.message,
            },
          });
          //   this.setState({
          //     showEmail: false,
          //     showPassword: true,
          //     userCompaniesList: data,
          //     pageloading: false,
          //   });
        } else {
          if (parseInt(response.code) === 401) {
            this.showMessage(response.message, "error");
          }
          dispatch({
            type: GET_USER_COMPANIES,
            payload: {
              companiesList: [],
              message: response.message,
            },
          });
          //   this.setState({
          //     pageloading: false,
          //   });
        }
      })
      .catch((error) => console.log(error));
  };
};
