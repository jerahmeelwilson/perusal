import React from 'react';
import {useFormik} from 'formik'
import axios from 'axios';
import './Login.css'
import { useNavigate } from 'react-router-dom'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({setLogin}) {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: ""
  }
  const onSubmit = async (values) => {
    axios.post('http://localhost:4001/auth/login', values)
    .then((res) => {
      if(res.data.token){
        localStorage.setItem("token", res.data.token);
        setLogin(true);
        toast.success("Login Successfull");
        navigate('/'); 
      } else{
        toast.error(res.data);
      }
    }).catch((err) => {
      toast.error(err.response.data);
    })


  }
  const validate = (values) => {
    const errors = {}
    if(!values.username) {
      errors.username = "Username Required"
    }
    if(!values.password) {
      errors.password = "Password Required"
    } else if(values.password.length < 8) {
      errors.password = "Password must be longer than 8 Characters."
    }
    return errors;
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate
  })


  return <div className='loginPage'>
    <h2>Login</h2>
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <input
        type="text"
        name="username"
        onChange={formik.handleChange}
        value={formik.values.username}
        placeholder='Username'
         />
      <input
        type="password"
        name="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder='Password'
         />
         <button type='submit' disabled={!formik.isValid}>Submit</button>
    </form>
    {formik.errors.username ? <div className='validationError' >{formik.errors.username}</div> : null}
    {formik.errors.password ? <div className='validationError' >{formik.errors.password}</div> : null}
  </div>;
}

export default Login;
