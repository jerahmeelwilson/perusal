import React from "react";
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
function Register({setLogin}) {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const onSubmit = async (values) => {
    axios.post('http://localhost:4001/auth/register', values)
    .then((res) => {
        if(res.data.token){
            localStorage.setItem("token", res.data.token);
            setLogin(true);
            toast.success("Registration Successfull");
            navigate('/'); 
          } else{
            toast.error(res.data);
          }
    }).catch((err) => {
      toast.error(err.response.data);
    })

  };
  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username Required";
    }
    if (!values.password) {
      errors.password = "Password Required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be longer than 8 Characters.";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please Confirm Password";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Password must Match";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.name}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          placeholder="Confirm Password"
        />
        <button type="submit" disabled={!formik.isValid}>
          Submit
        </button>
      </form>
      <div>
        {formik.errors.username ? <div>{formik.errors.username}</div> : null}
        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
        {formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
      </div>
    </div>
  );
}

export default Register;
