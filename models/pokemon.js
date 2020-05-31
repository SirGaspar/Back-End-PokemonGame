module.exports = class Pokemon {

    // PokemonId;
    // id;
    // name;
    // level;
    // item;
    // spriteName;

    // maxHP;
    // hp;
    // atk;
    // def;
    // spAtk;
    // spDef;
    // speed;

    // hpIV;
    // atkIV;
    // defIV;
    // spAtkIV;
    // spDefIV;
    // speedIV;

    // baseHp;
    // baseAtk;
    // baseDef;
    // baseSpAtk;
    // baseSpDef;
    // baseSpeed;

    // specialStatus;

    constructor(id) {
        const http = require('https');
        this.id = id;
        this.item = null;
        this.specialStatus = [];

        var options = {
            host: 'http://localhost',
            port: 3200,
            path: `/${id}`,
            method: 'GET'
          };
          
          http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
            });
          }).end();

        this.name = '';
        this.level = 0;
        
        this.spriteName = '';
        this.maxHP = 0;
        this.hp = 0;
        this.atk = 0;
        this.def = 0;
        this.spAtk = 0;
        this.spDef = 0;
        this.speed = 0.
        this.hpIV = 0;
        this.atkIV = 0;
        this.defIV = 0;
        this.spAtkIV = 0;
        this.spDefIV = 0;
        this.speedIV = 0.
        this.baseHp = 0;
        this.baseAtk = 0;
        this.baseDef = 0;
        this.baseSpAtk = 0;
        this.baseSpDef = 0;
        this.baseSpeed = 0.
        
    }



}