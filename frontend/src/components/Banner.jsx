import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='flex bg-primary rounded-lg  p-6 py-0 px-6 sm:px-10 md:px-0 lg:px-0 my-20 '>
            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative '>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:pb-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl md:pr-6 lg:text-5xl  text-white'>
                    <p className='gradientAnimation font-semibold'>Український координаційний центр</p>
                    <p className='mt-4 text-sm lg:text-s '>Зареєструйтесь, і ви зможете в повній мірі приєднатись до української спільноти через Український координаційний центр.</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Зареєструватись</button>
            </div>

        </div>
    )
}

export default Banner