import React from 'react'

const NavAuthComponent = () => {

    const authList = [
        { labelName: "Sign-up" },
        { labelName: "Log In" },
        {labelName:"Log Out"}
    ]
  return (
      <div className='flex mr-2 p-2'>
          <ul className='flex flex-col gap-3 font-serif'>
              {authList.map((item, index) => (
                  <li key={index} className='dark:bg-zinc-700 bg-indigo-200 dark:text-zinc-400 rounded-lg flex justify-center p-1 hover:text-gray-100 hover:underline dark:hover:text-scale-105 '>{ item.labelName}</li>
              ))}
          </ul>
    </div>
  )
}

export default NavAuthComponent