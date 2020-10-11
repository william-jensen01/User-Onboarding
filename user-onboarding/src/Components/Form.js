import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

export default function Form() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    // temporary state used to display response from API
    const [users, setUsers] = useState(null)

    // validating one key/value pair at a time
    const validateChange = (e) => {
        yup
            .reach(formSchema, e.target.name)
            .validate(
                e.target.type === "checkbox" ? e.target.checked : e.target.value
            )
            .then((valid) => {
                // the input is passing!
                setErrors({...errors, [e.target.name]: ""})
            })
            .catch((error) => {
                // the input is breaking the schema
                setErrors({ ...errors, [e.target.name]: error.errors[0] });
            })
    };

    // onSubmit function
    const formSubmit = (e) => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then((res) => {
                console.log("axios res", res);
                setUsers({...users, [users]: res.data});
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                    terms: false
                })
            })
    }

    // onChange function
    const inputChange = (e) => {
        e.persist();
        const newFormState = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        };

        validateChange(e);
        setFormState(newFormState);
    }

    // used to determine wheter the input is valid or not
    const formSchema = yup.object().shape({
        name: yup.string().required("Name is required."),
        email: yup.string().email().required("Please enter a valid email."),
        password: yup.string().required("Password is required"),
        terms: yup.boolean().oneOf([true])
    });

    useEffect(() => {
        formSchema.isValid(formState).then((valid) => {
            console.log("is my form valid?", valid);
            setButtonIsDisabled(!valid);
        });
    }, [formState])

    console.log("formState", formState)
    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name
                <input 
                    id="name"
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                    data-cy="name"
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>

            <label htmlFor="email">
                Email
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={inputChange}
                    data-cy="email"
                />
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>

            <label htmlFor="password">
                Password
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={inputChange}
                    data-cy="password"
                />
                {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>

            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms and Conditions
                {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null}
            </label>

            <button type="submit" disabled={buttonIsDisabled} data-cy="submit">Submit</button>
            <h2>This is the API response</h2>
            {users && <pre>{JSON.stringify(users, null, 5)}</pre>}
        </form>
    )
}