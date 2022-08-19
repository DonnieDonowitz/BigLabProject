import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarProfile from './NavbarProfile.js';
import NavbarForm from './NavbarForm.js';


function HomeNavbar(props){
    const title = props.title;
    const howToExpand = props.howToExpand || 'sm';
     
    return (
    <Navbar onToggle = {props.show} expand={howToExpand} bg="success" variant='dark' sticky="top" >
        <Link to='/login'>
            <Navbar.Brand className='text-light' >
                    <img src="/img/todo2.png" width="40px" height="40px" className="m-1 d-inline-block align-text-center" alt = 'logo'/>
                {title}
            </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="homeNavbar" aria-expanded="true" />
        <Navbar.Collapse id="homeNavbar">
            <NavbarForm />  
            <NavbarProfile username={props.username} doLogOut={props.doLogOut}/>   
        </Navbar.Collapse>
    </Navbar>);
    
}

export default HomeNavbar;