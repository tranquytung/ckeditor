const BaseController = require('./base-controller');
const HomeModel = require('../model/elasticsearch/home-model');
const DeviceModel = require('../model/elasticsearch/device-model');

//------Create New ----
const homeModel = new HomeModel();
const deviceModel = new DeviceModel();

class HomeController extends BaseController{
    constructor(){
        super();
    }

    /*
    * Show man hinh list danh sach ckedtor
    * */
    async showAllDevice(req, res, next){
        try {
            let list = await deviceModel.getAllContent();
            if(list){
                let data = list.hits.hits;
                res.render('partials/view-home', {
                    data: data
                });
            }
        }catch (e) {
            console.log(e);
        }
    }

    /*
    * create or update
    * */
    async getAllhome(req, res, next){
        try{
            homeModel.getAllHome((err, resp)=>{
                if(err){
                    console.log(err);
                }else {
                    let data = resp.hits.hits;
                    let device = [];
                    for(let hit of data){
                        device.push([hit._source.name,hit._id]);
                    }

                    res.render('partials/home', {
                        title: 'Test CkEditor Autocomplete',
                        device: JSON.stringify(device)
                    });
                }
            });
        }catch (e) {
            console.log(e);
        }
    }

    async getUpdatehome(req, res, next){
        try {
            let path = req.params.path;
            if(path){
                let resp = await homeModel.returnAll();
                let data = resp.hits.hits;
                let device = [];
                for(let hit of data){
                    device.push([hit._source.name,hit._id]);
                }
                let page = await deviceModel.searchPath(path);
                if(page) {
                    page = page.hits.hits;
                    let content,obj={};
                    for (let hit of page) {
                        content = hit._source.content;
                        obj['id'] = hit._id;
                        obj['name'] = hit._source.name;
                        obj['status'] = hit._source.status;
                    }

                    res.render('partials/home', {
                        title: 'Test CkEditor Autocomplete',
                        device: JSON.stringify(device),
                        content: JSON.stringify(content),
                        obj
                    });
                }
            }
        }catch (e) {
            console.log(e);
        }
    }


    /*
    * get thuoc tinh cua device select
    * */
    getDeviceById(req, res, next){
        try {
            let id = req.body.id;
            if(id){
                homeModel.getDeviceID(id,(err,resp)=>{
                    if(err){
                        console.log(err);
                        res.json({ data: []});
                    }else {
                        let list = resp._source;
                        let arr =[];
                        for (let i in list){
                            if(typeof list[i] == "object"){
                                for (let j in list[i]) {
                                    let obj = {};
                                    obj['id'] = i+'.'+j;
                                    obj['text'] = i+'.'+j;
                                    obj['state'] = {
                                        selected  : false
                                    };
                                    arr.push(obj);
                                }
                            }else {
                                let obj = {};
                                obj['id'] = i;
                                obj['text'] = i;
                                obj['state'] = {
                                    selected  : false
                                };
                                arr.push(obj);
                            }
                        }
                        res.json({ data: arr});
                    }
                })
            }else {
                req.json({'error': 'No properties !'});
            }
        }catch (e) {
            console.log(e);
        }
    }

    /*
    * update device
    * */
    async UpdateDevice(req, res, next){
        try {
            let data = req.body;
            let id = data.id;
            let path = this.formatUrl(data.name);

            if(!id){

                let page = await deviceModel.searchPath(path);
                if(page){
                    let total = page.hits.total;
                    console.log(total);
                    if(total){
                        res.json({error : 'Name is exits'});
                    }else {
                        data.path = path;
                        deviceModel.createDevice(data, (err, resp) =>{
                            if(err){
                                console.log(err);
                            }else {
                                res.json({success : 'create success'});
                            }
                        })
                    }
                }

            }else {
                data.path= path;
                let list = await deviceModel.updateDevice(data);
                if(list['success'].result){
                    res.json({success : 'update success'});
                }else {
                    res.json({success : 'update error'});
                }
            }
        }catch (e) {
            console.log(e);
        }
    }

    /*
    * insert value template handlebars
    * */
    async showPage(req, res, next){
        try {
            let path = req.params.path;

            if(path){
                let devices = await homeModel.returnAll();

                let data = {};
                for (let i of devices.hits.hits) {
                    let obj = {[i._id] : i._source};
                    data = Object.assign(data,obj)
                }

                let page = await deviceModel.searchPath(path);
                if(page){
                    page = page.hits.hits;
                    let code;
                    for( let hit of page){
                        code = hit._source.content;
                    }

                    res.render('partials/view-page', {
                        data: JSON.stringify(data),
                        code: code
                    });
                }
            }

        }catch (e) {
            console.log(e);
        }
    }

    /*
    * Delete template
    * */
    DeleteDivce(req, res, next){
        try {
            let id = req.body.id;
            deviceModel.deleteDevice(id, function (error, resp) {
                if(error){
                    res.json(error);
                }else{
                    res.json({success: "Delete was deleted", data: resp});
                }
            });
        }catch (e) {
            console.log(e);
        }
    }

    formatUrl(text){
        let str = text;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        str = str.replace(/đ/g,"d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        str = str.replace(/ + /g," ");
        str = str.replace(/\s/g, '_');
        str = str.trim();
        return str;
    }
}

module.exports = HomeController;

