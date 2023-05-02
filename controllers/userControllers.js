const User = require("../models/User");
const bcrypt = require("bcrypt");
const { uploadImg } = require ("../utils/cloudinary");
const fs = require("fs-extra");



const aut0Login = async (req, res) => {

  console.log(req.body)
  
  try {

    const user = await User.findOne({email : req.body.email});
    
    
    if(!user){
      
        const newUser = new User({
        name: req.body.name,
        email: req.body.email,       
      });
      await newUser.save();
      return res.status(201).json({
        ok: true,
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
  
      });     
    }

    return res
    .status(200)
    .json({
      ok: true, 
      user : { id: user._id, name: user.name, email: user.email }});

    

  } catch (err) {
    return res.status(503).json({
      ok: false,
      message: "Something happened"
    });
  }
};



const editImage = async (req, res) => {
  console.log(req.body)
  const { userId } = req.body;


  try {
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    const result = await uploadImg(req.files.file.tempFilePath);
    console.log(result);
    user.img = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    await fs.unlink(req.files.file.tempFilePath);

    await user.save();

    return res.status(200).json({
      ok: true,
      img: user.img.secure_url,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};


module.exports = {
  editImage,
  aut0Login
};
