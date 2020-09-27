import React, {useState} from "react";
import {Redirect} from "react-router"
import {httpConfig} from "../../shared/utils/http-config";
import FormControl from 'react-bootstrap/FormControl'
import * as Yup from "yup";
import {Formik} from "formik";
import {useHistory} from "react-router-dom"

import {SignInFormContent} from "./SignInFormContent";

export const SignInForm = () => {
	const history = useHistory();
	const signIn = {
		userEmail: "",
		userPassword: ""
	};

	const validator = Yup.object().shape({
		userEmail: Yup.string()
			.email("email must be a valid email")
			.required('User Email is required'),
		userPassword: Yup.string()
			.required('Password is required')
	});

	const submitSignIn = (values, {resetForm, setStatus}) => {
		httpConfig.post('/apis/sign-in/', values)
			.then(reply => {
				let {message, type} = reply;
				if(reply.status === 200 && reply.headers["x-jwt-token"]) {
					window.localStorage.removeItem("jwt-token");
					window.localStorage.setItem("jwt-token", reply.headers["x-jwt-token"]);
					resetForm();
					history.push("/main-page");
				}
				setStatus({message, type});
			});
	};

	return (
			<Formik
				initialValues={signIn}
				onSubmit={submitSignIn}
				validationSchema={validator}
			>
				{SignInFormContent}
			</Formik>
	)
};
