import { LogoutButton} from './LoginForm.js';

function NavbarProfile(props){
    const username = props.username || '';
    const welcomeStr = username? 'Welcome, '+ props.username + '!' :'';  

    return (
        <div className='ml-auto text-light'>
            <img alt='profile pic' src="/img/profile.png" width="40px" height="auto" className="m-0 d-inline-block " />
            <h5 className="d-inline-block mx-2 text-center pagination-centered"> {welcomeStr}</h5>
            {username ? <LogoutButton logout={props.doLogOut} /> : ''}
        </div>
    );
    
}

export default NavbarProfile;