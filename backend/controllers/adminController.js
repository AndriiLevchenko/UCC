import validator from "validator";
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const addDoctor = async (req, res)=>{
    try {
        const {name, email, password, speciality, experiencedate, about, fees, address} = req.body;
        const imageFile = req.file;

        // checking if all Data to add doctor
        if(!name || !email || !password || !speciality || !experiencedate || !about || !fees || !address) {
           return res.json({success: false, message: 'Missing details'})
        }

        // checking an e-mail to add doctor
        // if(!validator.isEmail(email)){
        //     return res.json({success: false, message: 'Enter a valid e-mail'})
        // }

        // hashing doctor's  Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
console.log("name in Controller = ", name);
        // validating strong password
        if(password.length < 8){
            return res.json({success: false, message: 'Enter a strong Password'})
        }

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            experiencedate,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save()
        res.json({success: true, message: "Консультаційний день додано"})

    } catch (error) {
        console.log("error = ", error)
        res.json({success: false, message: error.message})
    }
}

//API for Admin Login
const loginAdmin = async (req, res)=> {
    try {
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Invalid credentials"})
        }
    } catch (error) {
        console.log("error = ", error)
        res.json({success: false, message: error.message})
    }
}

// API to get all doctors list for Admin Panel
const allDoctors = async (req, res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success: true, doctors});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get all appointments list
const appointmentsAdmin = async (req, res)=> {
    try {
        const appointments = await appointmentModel.find({});
        res.json({success: true, appointments});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API for Admin appointment cancellation
const appointmentCancel = async (req, res)=> {
    try {
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});
        //releasing doctors slot
        const {docId, slotDate, slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, {slots_booked});
        res.json({success: true, message: 'Appointment cancelled'});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: 'натурі istAppoinyments'});
    }
}

//API to get dashboard data for Admin panel
const adminDashboard = async (req, res)=> {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({success: true, dashData});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}