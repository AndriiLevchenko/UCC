import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const RelatedDoctors = ({ speciality, docId }) => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const [filterDoc, setFilterDoc] = useState([]);
    const [relDoc, setRelDoc] = useState(filterDoc);

    const applyFilter = () => {
        const today = new Date();
        setFilterDoc(doctors.filter(doc => {
            //const timeName = doc.name;
            const timeDate = new Date(doc.name.slice(3, 5) + "/" + doc.name.slice(0, 2) + "/" + doc.name.slice(6, 10));
            //console.log("  timeDate, today.getTime(), timeDate.getTime()  = ", timeDate, today.getTime(), timeDate.getTime());
            //console.log("  new Date()  = ", new Date('11/09/2024').getTime() -  new Date('11/08/2024').getTime());
            //console.log("  timeDate, today  = ", timeDate, today );
            return timeDate.getTime() >= (today.getTime())
        }));
        // if (filterDoc.length > 0 && speciality) {
        if (filterDoc.length > 0) {
            const doctorsData = filterDoc.filter((doc) => doc._id !== docId);
            console.log("doctorsData = ", doctorsData);
            let sortedDoctors = doctorsData.sort((c1, c2) => (c1.experiencedate > c2.experiencedate)  ? 1 : (c1.experiencedate < c2.experiencedate) ? -1 : 0);
            console.log("sortedDoctors = ", sortedDoctors);
            setRelDoc(sortedDoctors)
        }
    }
    useEffect(() => {
        applyFilter()
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Інші дні</h1>
            <p className='sm:w-1/2 text-center text-sm'>Оберіть інший день для зустрічі</p>
            <div className=' flex flex-wrap justify-between w-full gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDoc.map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] w-[260px] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* <button className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button> */}
        </div>
    )
}

export default RelatedDoctors