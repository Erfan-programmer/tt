import React from 'react'
import "./Button.css"
type ButtonType = {
    children:React.ReactNode
}
export default function Button({children}:ButtonType) {
  return (
    <button className='topBarBg py-3 px-8 md:px-5  text-[#222] font-semibold flex justify-center items-center gap-2'>{children}</button>
  )
}
