const router = require('express').Router();
const homeController= require('../controller/home-controller');


const homecontroller = new homeController();

router.get('/home', (req, res, next) =>{
    homecontroller.getAllhome(req, res, next);
});

router.get('/home/:path', (req, res, next) =>{
    homecontroller.getUpdatehome(req, res, next);
});

router.get('/view', (req, res, next)=>{
    homecontroller.showAllDevice(req, res, next);
});

router.post('/getID', async(req, res, next)=>{
    homecontroller.getDeviceById(req,res,next);
});

router.post('/save', (req, res, next) =>{
    homecontroller.UpdateDevice(req, res, next);
});

router.get('/page/:path',(req, res, next) =>{
    homecontroller.showPage(req, res, next);
});

router.delete('/delete',(req,res, next) =>{
    homecontroller.DeleteDivce(req, res, next);
});


module.exports = router;