import React, {useContext, useEffect, useState} from 'react'
import {AdminContext} from "../../context/AdminContext.jsx";

const DoctorsList = () => {

    const {doctors, getAllDoctors, aToken, changeAvailability} = useContext(AdminContext);
    const [filterDoc, setFilterDoc] = useState([]);
    const applyFilter = () => {
        console.log("new Date() = ", new Date());
        const firstJanuary = new Date(new Date().getFullYear(), 0, 1);
        const newDoctors = doctors.filter(doc =>{
            const timeDate = new Date(doc.name.slice(3, 5) + "/" + doc.name.slice(0, 2) + "/" + doc.name.slice(6, 10));
            console.log("  timeDate, firstJanuary.getTime(), timeDate.getTime()  = ", timeDate, firstJanuary.getTime(), timeDate.getTime());
            return timeDate.getTime() >= (firstJanuary.getTime())
        });
        const sortedDoctors = newDoctors.sort((c1, c2) => (c1.experiencedate > c2.experiencedate)  ? 1 : (c1.experiencedate < c2.experiencedate) ? -1 : 0);
        console.log("  sortedDoctors  = ", sortedDoctors );
        setFilterDoc(sortedDoctors);
    }
    useEffect(()=>{
        if(aToken) {
            getAllDoctors();
        }
    }, [aToken])
    useEffect(()=>{
        applyFilter();
    }, [doctors])
    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {
                    filterDoc.map((item, index)=>(
                        <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                            <div className='p-4'>
                                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                                <div className='mt-2 flex items-center gap-1 text-sm'>
                                    <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                                    <p>Available</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default DoctorsList
