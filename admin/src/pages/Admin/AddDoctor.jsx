import React, {useContext, useEffect, useState} from 'react'
import {assets} from "../../assets/assets.js";
import {AdminContext} from "../../context/AdminContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('Olena');
    const [email, setEmail] = useState('uainfmm@gmail.com');
    const [password, setPassword] = useState('');
    const [experiencedate, setExperienceDate] = useState('');
    const [fees, setFees] = useState('0');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('Консультант');
    const [address1, setAddress1] = useState('60326 Frankfurt am Main');
    const [address2, setAddress2] = useState('Mainzer Landstraße 293');


    const {backendUrl, aToken, doctors, getAllDoctors} = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if(!docImg) {
                return toast.error('Image not selected')
            }

            console.log(' new  experiencedate = ',   new Date(experiencedate));

            //const date = docSlots[slotIndex][0].datetime
            // let day = experiencedate.slice(9, 10);
            // let month = experiencedate.slice(6, 7);
            // let year = experiencedate.slice(0, 4);
            // let newDate = day + "_" + month + "_" + year;
            const newExpDate =  new Date(experiencedate);
            const formattedDate =  newExpDate.toLocaleDateString('en-GB', { year: 'numeric', day: '2-digit', month: '2-digit' }).replace(/[/]/g, '_');;
            console.log(' newExpDate, formattedDate, newExpDate.getTime() = ',  newExpDate, formattedDate, newExpDate.getTime());
            console.log('experiencedate', experiencedate);
            const formData = new  FormData();
            formData.append('image', docImg);
            formData.append('name', formattedDate);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experiencedate', formattedDate);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('address', JSON.stringify({line1: address1, line2: address2}));
            formData.append('date', newExpDate.getTime());


            //console.log(formData)
            formData.forEach((value, key)=>{
                console.log(`${key} : ${value}`);
            })



            console.log('formData = ',  formData);
            //console.log('doctors.find = ',  doctors.find((doc)=> doc.experiencedate === formattedDate).experiencedate);
            if(doctors.find((doc)=> doc.experiencedate === formattedDate)) {
                toast.warning('Деь' + formattedDate + 'вже в роботі. Оберіть наступний');
            } else {
                const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers: {aToken}});
                console.log('formattedDate = ',  formattedDate);
                console.log('doctors.experiencedate = ',  doctors.find((doc)=> doc.experiencedate === formattedDate));
                if(data.success) {
                    toast.success(data.message);
                    setDocImg(false);
                    setName('');
                    setEmail('uainfmm@gmail.com');
                    setPassword('Uktainischencenter2024');
                    setAbout('');
                    setFees('0');
                    setAddress1('60326 Frankfurt am Main');
                    setAddress2('Mainzer Landstraße 293');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
            console.log('error = ', error);
        }
    }
    useEffect(()=>{
        if(aToken) {
            getAllDoctors();
        }
    }, [aToken])
    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Berater</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll '>
                <div className='flex items-center gap-4 mb-8 text-gray-500 '>
                    <label htmlFor={'doc-img'} >
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e)=>setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
                    <p>Upload Berater picture</p>
                </div>
                <div className='flex flex-col items-start lg:flex-row gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4 '>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Berater name</p>
                            <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-4 py-2' type='text' placeholder='Olena' required/>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Berater email</p>
                            <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-4 py-2'  type='email' placeholder='uainfmm@gmail.com' required/>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Berater password</p>
                            <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border rounded px-4 py-2'  type='password' placeholder='Uktainischencenter2024' required/>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Date</p>
                            <input onChange={(e)=>setExperienceDate(e.target.value)} value={experiencedate} type="date" id="start" name="trip-start"  min="2024-11-01" max="2028-11-01" />
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Fees</p>
                            <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-4 py-2'  type='number' placeholder='Fees' required/>
                        </div>
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4 '>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Speciality</p>
                            <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border rounded px-4 py-2'   name='' id=''>
                                <option value='General physician'>Консультант</option>
                                <option value='Gynecologist'>Консультант</option>
                                <option value='Dermatologist'>Консультант</option>
                                <option value='Pediatrician'>Консультант</option>
                                <option value='Neurologist'>Консультант</option>
                                <option value='Gastroenterologist'>Консультант</option>
                            </select>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p> Address</p>
                            <input onChange={(e)=>setAddress1(e.target.value)} value={address1}  className='border rounded px-4 py-2'  type='text' placeholder='Frankfurt-am-Main' required/>
                            <input onChange={(e)=>setAddress2(e.target.value)} value={address2}  className='border rounded px-4 py-2'  type='text' placeholder='Mainzer Landstraße 293' required/>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='mt-4 mb-2'> About Doctor</p>
                    <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='write about doctor' rows={5} required/>
                </div>
                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
            </div>
        </form>
    )
}
export default AddDoctor
