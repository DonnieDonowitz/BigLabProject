import { Form, Button} from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
    const [username, setUsername] = useState('mario.rossi@gmail.com');
    const [password, setPassword] = useState('student');
    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errorsFound = validateForm();

        if (Object.entries(errorsFound).length === 0) {
            const credentials = { username: username, password: password };
            props.login(credentials);
        } else {
            setValidationErrors(errorsFound);
        }
    }

    const validateForm = () => {
        const errorsFound = {};

        if (!username || username.trim() === '' || !username.includes('@') || !username.includes('.')) {
            errorsFound.username = 'Please provide a valid email.';
        }

        if (!password || password.length < 6) {
            errorsFound.password = 'Your password is too short. Please provide a valid password.';
        } else if (password.length > 20) {
            errorsFound.password = 'Your password is too long. Please provide a valid password.';
        }

        return errorsFound;
    }

    const onChangeUsername = (value) => {
        setUsername(value);

        if ('username' in validationErrors) {
            const { username, ...rest } = validationErrors;
            setValidationErrors(rest);
        }
    }

    const onChangePassword = (value) => {
        setPassword(value);

        if ('password' in validationErrors) {
            const { password, ...rest } = validationErrors;
            setValidationErrors(rest);
        }
    }

    return (
        <section className='m-2'>
            <h2>Login</h2>
            <Form>
                <Form.Group controlId='username'>
                    <Form.Label>email</Form.Label>
                    <Form.Control type='email' value={username} onChange={ev => onChangeUsername(ev.target.value)} isInvalid={'username' in validationErrors} />
                    <Form.Control.Feedback type='invalid'>
                        {validationErrors.username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={ev => onChangePassword(ev.target.value)} isInvalid={'password' in validationErrors}/>
                    <Form.Control.Feedback type='invalid'>
                        {validationErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant='outline-success' onClick={handleSubmit}>Login</Button>
            </Form>
        </section>)
}

function LogoutButton(props) {
    return (
        <Button variant="light" onClick={props.logout}>Logout</Button>
    )
}

export { LoginForm, LogoutButton };