import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)
  console.log("doctors = ", doctors);
  const applyFilter = () => {
    console.log("new Date() = ", new Date());
    const today = new Date();
      const newDoctors = doctors.filter(doc =>{
        const timeName = doc.name;
        const timeDate = new Date(doc.name.slice(3, 5) + "/" + doc.name.slice(0, 2) + "/" + doc.name.slice(6, 10));
        console.log("  timeDate, today.getTime(), timeDate.getTime()  = ", timeDate, today.getTime(), timeDate.getTime());

        return timeDate.getTime() >= (today.getTime())
        // return timeDate.getTime() >= (today.getTime() - 9586400000)
      });
    console.log("  newDoctors  = ", newDoctors );
      const sortedDoctors = newDoctors.sort((c1, c2) => (c1.experiencedate > c2.experiencedate)  ? 1 : (c1.experiencedate < c2.experiencedate) ? -1 : 0);
    console.log("  sortedDoctors  = ", sortedDoctors );
      setFilterDoc(sortedDoctors);
  }

  useEffect(() => {
    applyFilter()
  }, [doctors])

  const months = [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    console.log("dateArray = ", dateArray);
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }
  console.log("filterDoc = ", filterDoc);
  return (
    <div>
      {/*<p className='text-gray-600'>Browse through the doctors specialist.</p>*/}
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/*<button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>*/}
        {/*<div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>*/}
        {/*  <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>General physician</p>*/}
        {/*  <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gynecologist</p>*/}
        {/*  <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatologist</p>*/}
        {/*  <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatricians</p>*/}
        {/*  <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p>*/}
        {/*  <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p>*/}
        {/*</div>*/}
        <div className='flex flex-wrap'>
          { filterDoc.length > 0
          ? filterDoc.map((item, index) => (
            <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border block  border-[#C9D8FF] w-[240px] rounded-xl m-6 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Є вільний час' : "На жаль весь час вичерпано"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'> {slotDateFormat(item.name)}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))
          : <div> Наразі немає Термінів</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors