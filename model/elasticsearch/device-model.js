const BaseModel = require('./base-model');


class DeviceModel extends BaseModel{
    constructor(){
        super();
        this.type_net = 'net-device';
    }

    /*
    * get all data
    * */
    getAllContent(){
        return this.returnAll();
    }

    /*
    * create
    * */
    createDevice( req, callback){
        let body ={
            name: req.name,
            path: req.path,
            content: req.content,
            status: req.status === 'true',
            createdDate: new Date(),
        };
        this.put(body,callback);
    }

    /*
    * update
    * */
    updateDevice(req){
        let id = req.id;
        let data = {
            name: req.name,
            path: req.path,
            status: req.status === 'true',
            content: req.content,
        };

        return this.update(id, data);
    }


    /*
    * get value id
    * */
    returnbyID(id){
        return this.returnByID(id);
    }

    /*
    * delete id
    * */
    deleteDevice(id, callback){
        this.delete(id, callback);
    }

    /*
    * search path
    * */
    searchPath(path){
        let body = {};
        body['size']= 1000;
        body['query']=  {
            "match_phrase": {
                "path.keyword": path
            }
        };

        return this.search(body);
    }

}

module.exports = DeviceModel;