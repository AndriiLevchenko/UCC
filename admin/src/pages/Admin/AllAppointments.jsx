import React, {useContext, useEffect, useState} from 'react'
import {AdminContext} from "../../context/AdminContext.jsx";
import {AppContext} from "../../context/AppContext.jsx";
import {assets} from "../../assets/assets.js";

const AllAppointments = () => {
    const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext);
    const {calculateAge, slotDateFormat, currency} = useContext(AppContext);
    const [filterAppointments, setFilterAppointments] = useState([]);

    const applyFilter = () => {
        console.log("filterAppointments = ", filterAppointments);
        const firstJanuary = new Date(new Date().getFullYear(), 0, 1);
        const newAppointments = appointments.filter(doc =>{
            const timeDate = new Date(doc.docData.name.slice(3, 5) + "/" + doc.docData.name.slice(0, 2) + "/" + doc.docData.name.slice(6, 10));
            console.log("  timeDate, firstJanuary.getTime(), timeDate.getTime()  = ", timeDate, firstJanuary.getTime(), timeDate.getTime());
            return timeDate.getTime() >= (firstJanuary.getTime())
        });
        const sortedAppointments = newAppointments.sort((c1, c2) => (c1.docData.experiencedate > c2.docData.experiencedate)  ? 1 : (c1.docData.experiencedate < c2.docData.experiencedate) ? -1 : 0);
        console.log("  sortedAppointments  = ", sortedAppointments );
        setFilterAppointments(sortedAppointments);
    }

    useEffect(()=> {
        if(aToken) {
            getAllAppointments();
        }
    }, [aToken])
    useEffect(()=>{
        applyFilter();
    }, [appointments])
    return (
        <div className='appointmentsTable w-full max-w-6xl m-3 '>
            <p className='mb-3 text-lg font-medium'>Всі призачені зустрічі</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
                <div className='hidden sm:grid grid-cols-[0.5fr_4fr_1fr_3fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b min-w-[684px]'>
                    <p>#</p>
                    <p>Відвідувач</p>
                    <p></p>
                    <p>Дата та час</p>
                    <p></p>
                    <p>Вартість</p>
                    <p>Дії</p>
                </div>
                {filterAppointments.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_4fr_1fr_3fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 min-w-[684px]' key={index}>
                        <p className='max-sm:hidden'>{index+1}</p>
                        <div className='flex items-center gap-2 min-w-[215px]'>
                            <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <div className='flex flex-col'><p><span>{item.userData.name}</span>, <span className='max-sm:hidden'>{calculateAge(item.userData.dob)}</span></p><p>{item.userData.email}</p></div>
                        </div>
                        <p></p>
                        <p className='flex flex-col'><span>{slotDateFormat(item.slotDate)}, </span><span>{item.slotTime}</span></p>
                        <div className='flex items-center gap-2'>
                            <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" />
                        </div>
                        <p>{currency}{item.amount}</p>
                        {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AllAppointments
