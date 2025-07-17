import React from "react";

const Button = ({
  buttonLabel = "",
  buttonWidth = "",
  buttonHeight = "",
  darkBackgroundProp = "",
  hoverProperties = "",
  icon = null,
    lightBackgroundProp = "",
  margin=""
}) => {
  return (
    <>
      <button
        className={`cursor-pointer rounded-xl flex justify-center items-center capitalize text-[18px] font-serif tracking-[1.25px] 
    ${buttonWidth} 
    ${buttonHeight} 
    ${darkBackgroundProp} 
    ${lightBackgroundProp} 
    ${hoverProperties} 
    ${margin}
    text-[10px]`}
      >
        {buttonLabel}
        {icon && (
          <span className="text-4xl flex items-center justify-center">
            {icon}
          </span>
        )}
      </button>
    </>
  );
};

export default Button;
