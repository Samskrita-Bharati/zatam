import React from 'react'
import ZatamLogoComponent from './NavbarComponents/ZatamLogoComponent'
import NavigationLinksComponent from "./NavbarComponents/NavigationLinksComponent"
import NavAuthComponent from './NavbarComponents/NavAuthComponent'

const Navbar = () => {
  return (
    <div className="flex justify-between pt-4 pb-4 items-center border-2 dark:border-gray-300">
      <div><ZatamLogoComponent/></div>
      <div><NavigationLinksComponent/></div>
      <div><NavAuthComponent/></div>
    </div>
  );
}

export default Navbar