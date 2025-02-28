import React, {useContext, useEffect} from 'react';
import {DoctorContext} from "../../context/DoctorContext.jsx";
import {AppContext} from "../../context/AppContext.jsx";
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
    const {dToken, appointments, getAppointments,  cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
    useEffect(()=> {
        if(dToken) {
            getAppointments();
        }
    }, [dToken]);
    console.log('appointments = ', appointments);
    return (
        <div className='w-full max-w-6xl m-5 '>

            <p className='mb-3 text-lg font-medium'>Всі призначені зустрічі</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Відвідувач</p>
                    <p>Платіж</p>
                    <p>Вік</p>
                    <p>Дата та час</p>
                    <p>Вартість</p>
                    <p>Дія</p>
                </div>
                {appointments.reverse().map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                        <p className='max-sm:hidden'>{index + 1}</p>
                        <div className='flex items-center gap-2'>
                            <img src={item.userData.image} className='w-8 rounded-full' alt=""/>
                            <p>{item.userData.name}</p>
                        </div>
                        <div>

                        </div>
                        <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                        <p>{currency}{item.amount}</p>
                        {item.cancelled
                            ? <p className='text-red-400 text-xs font-medium'>Відмінено</p>
                            : item.isCompleted
                                ? <p className='text-green-500 text-xs font-medium'>Виконано</p>
                                : <div className='flex'>
                                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel" />
                                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="tick" />
                                </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
export default DoctorAppointment
