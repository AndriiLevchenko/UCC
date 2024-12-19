import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Український координаційний центр надає підтримку українським переселенцям у Франкфурт</p>
        </div>

        <div>
          <p className='text-xl font-semibold mb-5'>УКЦ</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Домашня сторінка</li>
            <li>Політика конфіденційності</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-semibold mb-5'>КОНТАКТИ</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Mainzer Landstraße 293 , Frankfurt, Germany</li>
            <li>069 21273852</li>
            <li>uainfmm@gmail.com</li>
            <li>ucc-ffm.de</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ Prescripto.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
