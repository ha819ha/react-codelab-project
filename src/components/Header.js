import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
    render(){
        return(
            <li>
                <Link to = "/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );
    }
}
export default Header;