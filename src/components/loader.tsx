import React from 'react'

export default function Loader() {
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
        <div className='h-14 w-14 border-8 border-solid border-primary animate-spin rounded-full border-t-transparent'></div>
    </div>
  )
}
