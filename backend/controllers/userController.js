import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";


//API to register User
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.json({success: false, message: 'Missing details'})
        }
        if(!validator.isEmail(email)) {
            return res.json({success: false, message: 'Enter valid e-mail'})
        }
        if(password.left < 8) {
            return res.json({success: false, message: 'Enter strong password'})
        }
        //Hashing user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = {name, email, password: hashedPassword};
        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET );
        res.json({success: true, token});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

const loginUser = async(req, res)=> {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            res.json({success: true, token});
        } else {
            res.json({success: false, message: 'Invalid credentials'});
        }

    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get user profile data
const getProfile = async (req, res)=> {
    console.log('getProfile start 1 ');
    try {
        console.log('try req =, userId =   2 =', req);
        const {userId} = req.body;
        console.log(' userId =   3 =',  userId);
        const userData = await userModel.findById(userId).select('-password');
        console.log('userData =   2 =', userData);
        res.json({success: true, userData});

    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to update user profile data
const updateProfile = async (req, res)=> {
    try {
        const {userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        if (!name || !phone || !dob || !gender ) {
            return res.json({success: false, message: 'Data missing'})
        }
        await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address), dob, gender});
        if(imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, {image: imageURL});

        }
        res.json({success: true, message: 'Profile updated'});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to book appointment
const bookAppointment = async (req, res)=>{
    console.log("req in bookAppointment = ", req);
    try {
        const {userId, docId, slotDate, slotTime} = req.body;
        console.log('userId, docId, slotDate, slotTime  in Usercontroller = ', userId, docId, slotDate, slotTime);
         const docData = await doctorModel.findById(docId).select('-password');
         if(!docData.available) {
             return res.json({success: false, message: 'Doctor is not available'})
         }
         let slots_booked = docData.slots_booked;
         //alert("slots_booked = " + slots_booked);
        console.log("slots_booked = ", slots_booked);
         // checking for slots availability
         if(slots_booked[slotDate]) {
             if (slots_booked[slotDate].includes(slotTime)) {
                 return res.json({success: false, message: 'Slots are not available'})
             } else {
                 slots_booked[slotDate].push(slotTime);
             }
         } else {
             slots_booked[slotDate] = [];
             slots_booked[slotDate].push(slotTime);
         }
         const userData = await userModel.findById(userId).select('-password');
        console.log("slots_booked in userController = ", slots_booked);
        //console.log("docInfo userController = ", docInfo);
         delete docData.slots_booked;
         const appointmentData = {
             userId,
             docId,
             userData,
             docData,
             amount: docData.fees,
             slotTime,
             slotDate,
             date: Date.now()
         }
         const newAppointment = new appointmentModel(appointmentData);
        console.log("newAppointment  6 = ", newAppointment);
         await newAppointment.save();

         //Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})
        res.json({success: true, message: 'Appointment booked'});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: error.message});
    }
}

//API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res)=>{
    console.log("userId = ", req.body);
    try {
        const {userId} = req.body;
        console.log("userId = ", userId);
        const appointments = await appointmentModel.find({userId});
        res.json({success: true, appointments});
    } catch (error) {
        console.log('error = ', error);
        res.json({success: false, message: 'натурі istAppoinyments'});
    }
}

//API to cancel user appointments for frontend my-appointments page
const cancelAppointment = async (req, res)=> {
    try {
        const {userId, appointmentId} = req.body;
        const newObjectId =  new mongoose.Types.ObjectId(appointmentId);
        const appointmentData = await appointmentModel.findById(newObjectId);
        //verify appointment user
        if(appointmentData.userId !==  userId) {
            return res.json({success: false, message: 'Unauthorized action'})
        }
        await appointmentModel.findByIdAndUpdate(newObjectId, {cancelled: true});
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

//API to make payment of appointment

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment}

