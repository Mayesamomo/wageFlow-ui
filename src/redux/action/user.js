import API_URL from "../../api/server";
import axios from "axios";

//@desc load user

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
          type: "LoadUserRequest",
        });
        const { data } = await axios.get(`${API_URL}users/getuser`, {
          withCredentials: true,
        });
        dispatch({
          type: "LoadUserSuccess",
          payload: data.user,
        });
      } catch (error) {
        dispatch({
          type: "LoadUserFail",
          payload: error.response.data.message,
        });
      }
    };