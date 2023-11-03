import * as api from '../../api/index';
import { AUTH, CREATE_PROFILE } from './constants';


export const signin = (formData, toast, setLoading) => async (dispatch) => {
    try {
        const { data } = await api.loginUser(formData)
        dispatch({ type: AUTH, data })
        console.log(data)
        toast(data.message, 'success');

        window.location.href = '/dashboard'
    } catch (error) {
        console.log(error)
        toast(error, 'error');
        setLoading(false)
    }
}

export const signup = (formData, toast, setLoading) => async (dispatch) => {
    try {
        const { data } = await api.registerUser(formData)
        dispatch({ type: AUTH, data })
        const { info } = await api.createProfile({
            name: data?.result?.name,
            email: data?.result?.email,
            userId: data?.result?._id,
            phoneNumber: '', businessName: '',
            contactAddress: '',
            logo: '', website: ''
        });
        dispatch({ type: CREATE_PROFILE, payload: info });
        console.log(info)
        window.location.href = '/dashboard'
        toast('Registration Successful', 'success');

    } catch (error) {
        console.log(error)
        toast('Registration Failed', 'error');
        setLoading(false)
    }
}   