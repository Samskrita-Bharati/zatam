import { NavLink } from "react-router-dom";

const ZatamLogoComponent = () => {
  return (
    <div className="hidden md:flex items-center justify-center md:w-36 md:h-16 mr-5 ml-0 border-2">
      <NavLink to="/">
        <img
          src="/data/images/zatam.png"
          alt="Zatam Logo"
          className="w-full h-24 object-contain "
        />
      </NavLink>
    </div>
  );
};

export default ZatamLogoComponent;
