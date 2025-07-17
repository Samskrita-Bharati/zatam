import React from 'react'
import ZatamLogoComponent from './NavbarComponents/ZatamLogoComponent'
import NavigationLinksComponent from "./NavbarComponents/NavigationLinksComponent"
import NavAuthComponent from './NavbarComponents/NavAuthComponent'

const Navbar = () => {
  return (
    <div className="border-2 flex justify-between pt-4 pb-4 items-center">
      <div><ZatamLogoComponent/></div>
      <div className="border-2"><NavigationLinksComponent/></div>
      <div className="border-2"><NavAuthComponent/></div>
    </div>
  );
}

export default Navbar