const validator = require('validator');

exports.vEmail = (fieldName, errors, email)=> {
    if(!validator.isEmail(email)) {
        errors[fieldName] = "Please use valid email";
    }
};

exports.vEmpty = (fieldName, errors, value)=> {
    if(!value || validator.isEmpty(value)) {
        errors[fieldName] = "This field is required";
    }
};

exports.vNumeric = (fieldName, errors, value)=> {
    if(value !== undefined && value !== null) {
        if(!validator.isNumeric(value.toString())){
            errors[fieldName] = "Must be a number";
        }
    } else {
        errors[fieldName] = "Must be a number";
    }
};

exports.vPassword = (fieldName, errors, password)=> {
    if(!validator.isAscii(password)) {
        errors[fieldName] = "Invalid characters used in the password";
    }
    if(!validator.isLength(password, {min: 8, max: 25})){
        errors[fieldName] = "Password length must be not less than 8 characters and not more than 25 characters";
    }
};

exports.vIsJpegFile = (fieldName, errors, file)=>{
    if(file.mimetype !== "image/jpeg"){
        errors[fieldName] = "Uploaded file must be a picture of type JPEG";
    }
};