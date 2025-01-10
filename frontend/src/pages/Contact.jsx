import React from 'react'
import { assets } from '../assets/assets'
import {Link} from "react-router-dom";

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>НАШІ <span className='text-gray-700 font-semibold'>КОНТАКТИ</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>НАШ ОФІС</p>
          <p className=' text-gray-500'>Mainzer Landstraße 293 <br />60326 Frankfurt am Main</p>
          <p className=' text-gray-500'>Tel: +49(069) 212 73 852 <br /> Email: uainfmm@gmail.com</p>
          <p className=' font-semibold text-lg text-gray-600'>Волонтерство в Українському Координаційному Центрі</p>
          <p className=' text-gray-500'>Дізнайся більше про наші активності</p>
          <Link  className='bg-primary text-white text-sm font-medium hover:scale-105 px-20 py-3 rounded-full my-6' to={'https://www.facebook.com/uccfrankfurt/?locale=uk_UA'} >Дізнвтись</Link>
        </div>
      </div>

    </div>
  )
}

export default Contact
