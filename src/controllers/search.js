
const fileModel = require('../models/file');
const ratingModel = require('../models/rating');
var mongoose  = require('mongoose');

exports.homeSearch = async (req, res) => {

 let searchKeyword = new RegExp(req.body.searchkeywords,'i');

 let searchResult = await fileModel.find().
  populate({
    path: 'courseType',
    match: { name:  searchKeyword },
    select: 'name -_id'
  }).populate({
    path: 'docType',
    select: 'name -_id'
  }).
  exec();

let filterCheck = searchResult.filter(obj => obj.courseType !== null);


if (typeof filterCheck !== 'undefined' && filterCheck.length === 0) {
     searchResult = await fileModel.find({name: searchKeyword}).populate({
    path: 'docType',
    select: 'name -_id'
  });
}else{
   searchResult = filterCheck;
}
const likeRatio = [];
for (var i = 0; i < Object.keys(searchResult).length; i++) {
   const countLikes = await ratingModel.countDocuments({pdfId : searchResult[i]._id , like:true});
    const countDisLikes = await ratingModel.countDocuments({pdfId : searchResult[i]._id , like:false});
    
     let totalLikes = (countLikes / (countLikes + countDisLikes))*100;
         totalLikes = Math.round((Math.floor(totalLikes * 100 )/100))
        searchResult[i] = {...searchResult[i].toObject(), rating: totalLikes };
}

let   resultMessage =  `Search results for “ ${req.body.searchkeywords}” (${Object.keys(searchResult).length})`;
 res.render("browsingfile" , {searchResult , resultMessage});

}

exports.filterSearch = async (req, res) => {


 const searchKeyword = req.body.searchKeyword ;
 const courseType = (req.body.courseType);
 const docType =  (req.body.docType);
 const university =  (req.body.university);

 let  searchResult = "";
 const filterQuery = {};

 let courseTypePopulate = {
       path: 'courseType',
       select: 'name -_id'
  }


 if(courseType === "" && docType === "" && university === "" && searchKeyword === ""){

  res.json({"resultMessage": "Please Select Any filter"});
  return false;
}


 if(searchKeyword !== ""){
   var searchKeys =  new RegExp(searchKeyword,'i');
   courseTypePopulate = {
       path: 'courseType',
       match : {name : searchKeys},
       select: 'name -_id'
  }

  console.log(searchKeyword);
 }
 
 if(docType !== "" && docType !== undefined){
     filterQuery["docType"] = mongoose.Types.ObjectId(docType);
 }
 if(courseType !== "" && courseType !== undefined){
     filterQuery["courseType"] = mongoose.Types.ObjectId(courseType);
 }
 if(university !== "" && university !== undefined){
     filterQuery["university"] = mongoose.Types.ObjectId(university);
 }
  
    searchResult = await fileModel.find(filterQuery).populate({
    path: 'docType',
    select: 'name -_id'
  }).populate(courseTypePopulate).populate({
    path: 'university',
    select: 'name -_id'
  });

  let filterCheck = searchResult.filter(obj => obj.courseType !== null);
  let searchCourseType = filterCheck.map(a => a.courseType.name);
  let searchDocType = filterCheck.map(a => a.docType.name);
  let searchUniversity = filterCheck.map(a => a.university.name);
  searchResult = filterCheck;

  
for (var i = 0; i < Object.keys(searchResult).length; i++) {
   const countLikes = await ratingModel.countDocuments({pdfId : searchResult[i]._id , like:true});
    const countDisLikes = await ratingModel.countDocuments({pdfId : searchResult[i]._id , like:false});
    
    let totalLikes = (countLikes / (countLikes + countDisLikes))*100;
    totalLikes = Math.round((Math.floor(totalLikes * 100 )/100))
     searchResult[i] = {...searchResult[i].toObject(), rating: totalLikes };
}

  
let  resultMessage;
if(searchKeyword !== "" && searchKeyword !== undefined){
   resultMessage =  `Search result for “ ${searchKeyword} ” (${Object.keys(searchResult).length})`
}else if(courseType !== "" && courseType !== undefined){
     resultMessage =  `Search result for “ ${searchCourseType[0]}  ”  (${Object.keys(searchResult).length})`
}else if(docType !== "" && docType !== undefined){
     resultMessage =  `Search result for “ ${searchDocType[0]} ”  (${Object.keys(searchResult).length})`
}else if(university !== "" && university !== undefined){
     resultMessage =  `Search result for “ ${searchUniversity[0]} ”  (${Object.keys(searchResult).length})`
}else{
     resultMessage =  `Result Found  (${Object.keys(searchResult).length})`
} 

    

   if(Object.keys(searchResult).length === 0){

         res.json({resultMessage : `  Result Found (${Object.keys(searchResult).length})`});
        
   }else {
        res.json({"searchResult" : searchResult , "resultMessage" : resultMessage});
   }
 

}