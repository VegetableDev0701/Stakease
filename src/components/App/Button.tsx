import React from "react";

type Props = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => {
  return (
    <button
      className='btn'
      {...props}
    >
      <div>{props.children}</div>
    </button>
  );
};

export default Button;
