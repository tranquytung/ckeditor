const dotenv = require('dotenv');
const nconf = require('nconf');
const moment = require('moment');
const elastic = require('elasticsearch');
const uuid = require('uuid');

class BaseModel {
    constructor(){
        this.loadConfig();
        this._getIndex();
        this.index = nconf.get('elasticSearch').index;
        //this.index_net = nconf.get('elasticSearch').index_net;
        this.index_net = 'net-index-2019-05';
        this.type_net = nconf.get('elasticSearch').type_net;
        this.index_conf = nconf.get('elasticSearch').index_conf;
        this.client=elastic.Client({
            host: [
                nconf.get('elasticSearch').url_node1,
                nconf.get('elasticSearch').url_node2,
            ],
            sniffOnConnectionFault: true,
            maxRetries: 1
        });
    }

    loadConfig(){
        dotenv.config();
        nconf.use('memory');
        nconf.env();
        nconf.argv();
        require(__dirname + '/../../config/environments/' + nconf.get('APP_ENV'));
    }

    /*
    * get index-year-month
    * */
    _getIndex() {
        try {
            let date_month = moment().format('-YYYY-MM');
            this.index = nconf.get('elasticSearch').index + date_month;
            //this.index_net = nconf.get('elasticSearch').index_net + date_month;
            return;
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * get all callback
    * */
    getAll(callback){
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            this.client.search({
                index: this.index_net,
                type:this.type_net,
                body: {
                    from: "0", size: 1000,
                    query: {
                        'match_all': {}
                    }
                }
            }, function (err, resp) {
                callback(err, resp);
            });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * get all device
    * */
    async returnAll(){
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            return await this.client.search({
                index: this.index_net,
                type: this.type_net,
                body: {
                    from: "0", size: 1000,
                    query: {
                        'match_all': {}
                    }
                }
            });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * get id value callback
    * */
    getbyID(id, callback) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            this.client.get({
                index: this.index_net,
                type: this.type_net,
                id: id
            }, (err, resp) => {
                callback(err, resp);
            });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * get value id return
    * */
    async returnByID(id) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            return await this.client.get({
                index: this.index_net,
                type: this.type_net,
                id: id
            });
        }
        catch (ex) {
            console.log(ex)
        }
    }

    /*
    * create
    * */
    put(body, callback) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }

            let data = {
                index: this.index_net,
                type: this.type_net,
                id: uuid(),
                body: body
            };

            this.client.index(data, function (error, response) {
                callback(error, response);
            });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * update
    * */
    update(id, data) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            return new Promise((resolve, reject) => {
                this.client.update({
                    index: this.index_net,
                    type: this.type_net,
                    id: id,
                    body: {
                        doc: data
                    }
                }, (err, resp) => {
                    let result = {};
                    if (err) {
                        result = {
                            error: err
                        }
                    } else {
                        result = {
                            success: resp
                        }
                    }
                    resolve(result);
                });
            });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * delete
    * */
    delete(id, callback) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }
            this.client.delete({
                    index: this.index_net,
                    type: this.type_net,
                    id: id
                }
                , (err, resp) => {
                    callback(err, resp);
                });
        }
        catch (ex) {
            return [];
            console.log(ex)
        }
    }

    /*
    * search
    * */

    async search(body) {
        try {
            if (this.index != this.index_conf) {
                this._getIndex();
            }

            return await this.client.search({
                index: this.index_net,
                type: this.type_net,
                body: body
            });
        }
        catch (ex) {
            console.error(ex)
        }
    }

}

module.exports = BaseModel;