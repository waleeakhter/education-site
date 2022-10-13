const univeristyModel = require('../models/university');
const docTypeModel = require('../models/docType');
const courseTypeModel = require('../models/courseType');
exports.documentInfo = async () => {
      try{
        const univeristies=  await univeristyModel.find();
        const docTypes =  await docTypeModel.find();
        const courseTypes =  await courseTypeModel.find();
      return  { univeristies, docTypes, courseTypes }
      }catch(err){
           return {err}
      }
    
}


