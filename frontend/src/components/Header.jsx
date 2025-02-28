import React from 'react'
import { assets } from '../assets/assets';
import {useNavigate} from "react-router-dom";


const Header = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-14 '>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:pb-[10vw] md:mb-[-30px]'>
                <p className=' gradientAnimation text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Призначити зустріч
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm lg:text-s font-light'>
                    <img className='w-28' src={assets.group_profiles} alt="" />
                    <p>Зареєструйтесь, і ви зможете призначити зустріч в Українському координаційному центрі</p>
                </div>
                <a onClick={() => navigate('/doctors')}  className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] sm:text-base text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 cursor-pointer'>
                    Призначити зустріч <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative'>
                <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
            </div>
        </div>
    )
}

export default Header