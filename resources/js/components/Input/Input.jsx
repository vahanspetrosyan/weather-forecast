import React from 'react';
import './Input.scss';

const Input = (props) =>{
    return(
        <>
            <input
                type='text' id={props.id} required className={`form-control me-3 ${props.value && !props.valid ? "is-invalid" : ""}`} name={props.name} value={props.value}
                onChange={props.onChange}
                placeholder={props.labelname}
            />
        </>
    )
}

export default Input;
