import React from 'react';

class Authentication extends React.Component {
    render(){
        return (
            <div>
                Auth
            </div>
        )
    }
}
Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("login func not defined"); },
    onRegister: (id, pw) => { console.error("register func not defined"); }
}


export default Authentication;