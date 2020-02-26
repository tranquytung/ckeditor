const nconf = require('nconf');

nconf.set('elasticSearch', {
    url_node1: 'http://172.27.131.166:9200',
    url_node2: 'http://172.27.131.166:9200',
    index: 'idc-index',
    index_net: 'net-index',
    type_net: 'net-result',
    order: 'desc',
    username: 'elastic',
    password: 'changeme'
});

nconf.set('mysql', {
    //host: 'localhost',
    host: '172.27.131.166',
    username: 'root',
    password: 'iMonitor-ast@123', //'iMonitor-ast',
    database: 'idc-patrol',
    database1: 'idc-monitor'
});