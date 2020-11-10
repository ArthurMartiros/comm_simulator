import React                                                                             from 'react'
import { Alignment, Button, Classes, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { Link }                                                                          from "react-router-dom";
import { auth }                                                                          from "../services/AuthService";
import { useSelector }                                                                   from "react-redux";
import { getUser }                                                                       from "../selectors";

const NavbarComponent = () => {
  const user = useSelector(getUser);
  return (
    <Navbar className="bp3-dark" fixedToTop={true}>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>{user && user.id.match(/[^@]+/i)}</NavbarHeading>
        <NavbarDivider/>
        <Link to="/" className={'nav-link'}>
          <Button aria-label="To-Home" className={Classes.MINIMAL} text="Home"/>
        </Link>
        <Link to="/settings" className={'nav-link'}>
          <Button aria-label="To-Settings" className={Classes.MINIMAL} text="Settings"/>
        </Link>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button aria-label="To-Settings" className={Classes.MINIMAL} text="Log Out" onClick={() => auth.logout()}/>
      </NavbarGroup>
    </Navbar>
  )
};

export default NavbarComponent;