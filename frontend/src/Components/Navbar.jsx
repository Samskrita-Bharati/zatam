import React from 'react'
import ZatamLogoComponent from './NavbarComponents/ZatamLogoComponent'
import NavigationLinksComponent from "./NavbarComponents/NavigationLinksComponent"

const Navbar = () => {
  return (
    <div className="border-2 flex justify-between pt-4 pb-4 items-center">
      <div><ZatamLogoComponent/></div>
      <div className="border-2"><NavigationLinksComponent/></div>
      <div className="border-2">hello</div>
    </div>
  );
}

export default Navbar