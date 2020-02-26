
const BaseModel = require('./base-model');


class HomeModel extends BaseModel{
    constructor(){
        super();
    }

    getAllHome(callback){
        this.getAll(callback);
    }

    getDeviceID(id,callback){
        this.getbyID(id,callback);
    }
}

module.exports = HomeModel;