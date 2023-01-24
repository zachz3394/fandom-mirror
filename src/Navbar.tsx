import React, { useEffect, useState } from 'react';

const Navbar = () => {
  return(
    <div className='navbar-container'>
      <a href='/wiki/Main_Page' className='main-page-icon'>
        <div className='wookie-icon'></div>
        <h3 id='wookie' className='navbar-title'> Wookieepedia </h3>
      </a>
      <a className='navbar-option' href='/wiki/Wookieepedia:About'> About </a>
      <a className='navbar-option' href='/wiki/Wookieepedia:Contact'> Contact </a>
      <a className='navbar-option' href='/wiki/Wookieepedia:FAQ'> FAQ </a>
    </div>
  )
}

export default Navbar;