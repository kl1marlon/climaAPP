require("dotenv").config();


const axios = require("axios");
const fs = require("fs")

class Busqueda {

    historial = [];
    dbPath= "./db/database.json";

    constructor() {
      
    }
    
    get mapBoxKey(){
        return process.env.MAPBOX_KEY
    }
    
    
    get paramsMapbox() { 
        return { 
            "access_token": this.mapBoxKey,
            "limit": 5,
            "language": "es"
        }

    }   

    get paramsOW(){
        return{
            appid:process.env.OPENWEATHER_KEY,
            units:"metric",
            lang:"es"
        }
    }    
    

    async ciudad(lugar = "") {

        try {

           
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox


            })
            
            const resp = await instance.get();
            let datos=resp.data.features;
            return datos.map(lugar=>({
                id:lugar.id,
                nombre:lugar.place_name_es,
                longitud:lugar.center[0],
                latitud:lugar.center[1]
            })) 
            
            
            console.log(datos);

            
            return [];

        } catch (error) {
            return []
        }


    }

    async clima(lat,lon){

        try {

            const instance = axios.create ({

                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOW,lat,lon}
            })

            const resp=await instance.get();
            const datos=resp.data;
            const {weather,main}=datos;
            
            return{
                desc:weather[0],
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp,
                siente:main.feels_like

            }
            
        } catch (error) {
            console.log(error)
        }

    }


        agregarHistorial(lugar=""){
            if(this.historial.includes(lugar.toLocaleLowerCase())){
                return;
            }
            this.historial=this.historial.splice(0,5);

            this.historial.unshift(lugar.toLocaleLowerCase());
            this.guardarDB()
        }

        guardarDB(){
            const payload={
                historial:this.historial
            };                              
            fs.writeFileSync(this.dbPath, JSON.stringify(payload))

        }

        leerDB(){
            
            if(!fs.existsSync(this.dbPath)){
                return null
            }

            
            const info= fs.readFileSync(this.dbPath,{encoding:"utf-8"})
            const data=JSON.parse(info)
            
           return data.historial
             


        }
        cargarHistorial(historial=[]){
            historial.forEach(key=>{
                this.historial.push(key)
            })
        }
}

module.exports = Busqueda