import authActionTypes from "./types";
import authService from "./service";

import { push } from "connected-react-router";

function login(username, password, prevLocation) {
    return dispatch => {
        dispatch({ type: authActionTypes.LOGIN_REQUEST, username })
        authService.login(username, password)
            .then(user => {
                dispatch({ type: authActionTypes.LOGIN_SUCCESS, user: user, prevLocation: null });
                dispatch(push(prevLocation || "/"));
            })
            .catch(err => {
                // Error is unclonable and we can't directly put it in location state
                // We need to extract response data part
                let error = { response: { data: err.response.data } };
                dispatch({ type: authActionTypes.LOGIN_FAILURE});
                dispatch(push({ pathname: "/login", state: {error} }));
            })
    }
}

function logout(state, prevLocation) {
    return dispatch => {
        authService.logout();
        if(prevLocation && prevLocation.pathname === "/login")
            prevLocation = null;
        dispatch({ type: authActionTypes.LOGOUT, prevLocation });
        dispatch(push({ pathname: "/login", state }))
    }
}

function refreshCapabilities(state, prevLocation){
    
    return dispatch => {
        authService.refreshCapabilities()
            .then(capabilities => {
                let userPrevInfo = JSON.parse(localStorage.getItem("user"));
                console.log(userPrevInfo)
                let userInfo = {...userPrevInfo, capabilities: capabilities}
                console.log(userInfo)


                localStorage.setItem('user', JSON.stringify(userInfo))
                
                let capArray = [];
                
                for(let i in capabilities)
                    capArray.push(capabilities[i]);
            
                dispatch({type: authActionTypes.REFRESHCAPS, caps: capArray});
            })
    }
}

export default { login, logout, refreshCapabilities };