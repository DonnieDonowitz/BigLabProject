import { Form, FormControl } from 'react-bootstrap';

function NavbarForm(props) {
    return (
        <Form inline className="ml-auto">
            <FormControl type="text" placeholder="Search" />
        </Form>
    );
}

export default NavbarForm;