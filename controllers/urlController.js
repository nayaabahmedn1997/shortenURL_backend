
const {nanoid} = require('nanoid');
const urlModel = require('../models/urlModel');
const userModel = require('../models/userModel');


  //Update visitCount
const handleGenerateNewShortURL = async (req, res)=>{
    const {url} = req.body;
    if(!url)
    {
        return res.status(404).json({
            "message":"URL is required"
        })
    }
try {
    const shortID = nanoid();
    const newShortURL = new urlModel({
        shortID,
        redirectURL: url,
        visitHistory:[]
    });
    await newShortURL.save();
    return res.status(201).json({
        "message":'Short URl created'
    })

} catch (error) {
    return res.status(500).json({
        "message":"Internal server error"
    })
}
}


const getCompleteURL = async (req, res)=>{
    try {
        const {shortID} = req.params;
     
    
        const url = await urlModel.findOneAndUpdate({
            shortID
        },
    {
        $push:{
            visitHistory:{
                visitedAt: new Date()
            }
        },
        $inc:{clickCount: 1 },
    },{new: true}
        );
    
        if(!url)
        {
            return res.status(404).json({
                "message":"URL doesn't exists"
            })
        }
       
      return res.redirect(url.redirectURL);
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message":"Internal server error"
        })
    }
}


const fetchAllShortenedURLS = async (req, res)=>{
    try {
        const urls  = await urlModel.find();
        if(!urls)
        {
            return res.status(404).json({
                "message":"URL not found"
            })
        }
        return res.status(200).json({
            "message":"URLs fetched successfully",
            urlData:urls
        })
    } catch (error) {
        return res.status(500).json({
            "message":"Internal server error"
        })
    }
}


const totalURLSCreatedPerDay = async (req, res)=>{
    try {
        const data = await urlModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);
        return res.status(200).json({
            "message":"Data fetched successfully",
            data
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "message":"Internal server error"
        })
    }
    
}

const totalURLSCreatedPerMonth = async (req, res)=>{
    try {
        const data = await urlModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by month
        ]);
        return res.status(200).json({
            "message":"Data fetched successfully",
            data
        })
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
    
}


const totalClicksAllUrls = async (req, res)=>{
    try {
        const totalClicks = await urlModel.aggregate([
            { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } }
        ]);
        return res.status(200).json({
            "message":"Data fetched successfully",
            totalClicks:totalClicks[0]?.totalClicks || 0
        })
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
    

    
}


const totalUrls = async (req, res)=>{
    try {
        const totalUrls = await urlModel.countDocuments();
        return res.status(200).json({
            "message":"Data fetched successfully",
            totalUrls
        })
    } catch (error) {
        res.status(500).json({
            "message":"Internal server error"
        })
    }
}


module.exports = {handleGenerateNewShortURL, getCompleteURL, fetchAllShortenedURLS, totalURLSCreatedPerMonth, totalURLSCreatedPerDay, totalClicksAllUrls, totalUrls};