const Analytics = require('../model/analyticsModel');

//Middleware to track endpoint hits

const trackAnalytics = async(req,res,next)=>{
            const endpoint = req.path;
            const timestamp = new Date();

            try{
                //Find the document for the current endpoint or create a new one
                let analytics = await Analytics.findOne({endpoint});
                if(!analytics){
                    analytics = new Analytics({endpoint});
                }
                //Update hit count and timestamps
                analytics.hits +=1;
                analytics.timestamps.push(timestamp);

                //save the updated to the database
                await analytics.save();
                console.log(`Endpoint ${endpoint} was hit at ${timestamp}`);
                next();

            }

            catch(error){
                console.error('Error tracking analytics: ',error);
                res.status(500).send('Server error');
            }
             

};

//Controller to get analytics data
const getAnalytics = async(req,res)=>{
    try{
        const analyticsData = await Analytics.find();
        res.json(analyticsData);
    }
    catch(error){
        console.error('Error fetching analytics data: ',error);
                res.status(500).send('Server error');
    }
};

module.exports = {
    trackAnalytics,
    getAnalytics
};