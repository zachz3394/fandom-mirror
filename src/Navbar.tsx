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
      <a className='navbar-option' href='/wiki/R2-D2'> R2-D2 (Example) </a>
      <a className='navbar-option' href='/wiki/Anakin_Skywalker'> Anakin Skywalker (Example) </a>
    </div>
  )
}

export default Navbar;