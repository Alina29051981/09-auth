import React from 'react';
import css from './ErrorMessage.module.css';
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return <p className={css.text}>There was an error, please try again...</p>;
};

export default ErrorMessage;
