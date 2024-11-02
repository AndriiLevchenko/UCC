import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

const changeAvailability = async (req, res)=>{
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available});
        res.json({success: true, message: 'Availability changed'});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

const doctorList = async (req, res)=> {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({success: true, doctors})
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API for doctor Login
const loginDoctor = async (req, res)=> {
    try {
        console.log("req in backend Login = ", req);
        const {email, password} = req.body;
        const doctor = await doctorModel.findOne({email});
        if(!doctor) {
            return res.json({success: false, message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        console.log("password 1 = ", password);
        if(isMatch) {
            console.log("password 2 = ", password);
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET );
            res.json({success: true, token});
        } else {
            return res.json({success: false, message: 'Invalid credentials'});
        }
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res)=> {
    try {
        console.log('appointmentsDoctor start 1 =  req.body =  ', req.body);
        const {docId} = req.body;
        console.log('appointmentsDoctor start 2 =  id =  ', docId);
        const appointments = await appointmentModel.find({docId});
        res.json({success: true, appointments});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res)=> {
    console.log(' appointmentComplete in backend start  req 3 =  = ', req);
    try {
        const {docId, appointmentId} = req.body;
        console.log('docId, appointmentId 4 = ', docId, appointmentId);
        const newObjectId =  new mongoose.Types.ObjectId(appointmentId);
        const appointmentData = await appointmentModel.findById( newObjectId);
        console.log('appointmentData 5 = ', appointmentData);
        if(appointmentData && appointmentData.docId === docId ) {
            await appointmentModel.findByIdAndUpdate(newObjectId, {isCompleted: true});
            return res.json({success: true, message: 'Appointment completed'});
        } else {
            return res.json({success: false, message: 'Mark failed'});
        }
    } catch (error) {
        console.log('error req =  = ', error, req);
        res.json({success: false, message: error.message});
    }
}

//API to cancel appointment for doctor panel
const appointmentCancel = async (req, res)=> {
    console.log('appointmentCancel start  req 6 =  = ', req);
    try {
        const {docId, appointmentId} = req.body;
        const newObjectId =  new mongoose.Types.ObjectId(appointmentId);
        const appointmentData = await appointmentModel.findById( newObjectId);
        console.log('appointmentId 7 = ', appointmentId);
        if(appointmentData && appointmentData.docId === docId ) {
            await appointmentModel.findByIdAndUpdate( newObjectId, {cancelled: true});
            return res.json({success: true, message: 'Appointment cancelled'});
        } else {
            return res.json({success: false, message: 'Cancellation failed'});
        }
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get dashboard data  for doctor panel
const doctorDashboard = async (req, res)=> {
    try {
        const {docId} = req.body;
        const appointments = await appointmentModel.find({docId});
        let earnings = 0;
        appointments.map((item)=> {
            if(item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });
        let patients = [];
        appointments.map((item)=> {
            if(!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData});

    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get doctor profile for doctor panel
const doctorProfile = async (req, res)=> {
    try {
        const {docId} = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({success: true, profileData});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res)=> {
    try {
        const {docId, fees, address, available} = req.body;
        await doctorModel.findByIdAndUpdate(docId, {fees, address, available});
        res.json({success: true, message: 'Profile updated'});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel,
        doctorDashboard, doctorProfile, updateDoctorProfile}