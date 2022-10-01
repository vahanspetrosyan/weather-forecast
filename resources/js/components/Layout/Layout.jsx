import React from 'react';
import './Layout.scss';

const Layout =({children}) =>{
    return(
        <div className="container">{children}</div>
    )
}

export default Layout;
