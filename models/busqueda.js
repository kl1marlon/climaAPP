require("dotenv").config();

//aqui es desde donde se va a utilizar la peticioin http 
const axios = require("axios");
const fs = require("fs")

class Busqueda {

    historial = [];
    dbPath= "./db/database.json";

    constructor() {
        //TODO: leer db si existe 
    }
    //aqui estamos devolviendo la infor de la mapbox_key que esta guardad en la .env
    //esta linea de codigo nos va a devolver las variables de entorno 
    //console.log(process.env)
    get mapBoxKey(){
        return process.env.MAPBOX_KEY
    }
    
    //usamos este get para guardar la informacion de los parametros, retornamos la informacion que vamos a utilizar y con el this.paramsMapbox
    get paramsMapbox() { //podemos guardar esta informacion como un objeto literal sin embargo se recomienda guardarlo bajo las dos comillas
        return { 
            "access_token": this.mapBoxKey,//"pk.eyJ1Ijoia2wxbWFybG9uIiwiYSI6ImNrcDFuaDhuZTAzNngyb21sbzVuZGd2b2kifQ.uY4vqSU00zPT9J2YCGASXA",
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

            //peticion http
            //en esta instance vamos a guardar todos los parametros para 
            //hacer nuestra peticion 
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                //cuando veamos en una url el signo de ? esto significa que a partir de aqui vamos a recibir parametros
                params: this.paramsMapbox
                //este this.paramsMapbox hace referencia al get creado anteriormente 


            })
            //de esta manera usamos el get ya que dentro de la instancia estamos guardando toda la 
            //informacion que estamos guardando
            const resp = await instance.get();
            let datos=resp.data.features;
            return datos.map(lugar=>({//con map estamos devolviendo un objeto tranformando la data que recibimos
                id:lugar.id,
                nombre:lugar.place_name_es,
                longitud:lugar.center[0],
                latitud:lugar.center[1]
            })) //esto significa que voy a devolver un objeto de forma implicita({})

            
            
            console.log(datos);

            
            //console.log("ciudad:",lugar)

            //en resp estamos guardando la informacion (con get) la recibimos
            // const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?access_token=&=5&language=es`);
            //console.log(resp.data);
            return [];//retornar los lugares 

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
            //estamos creando constanres con el nombre de weather y main
            return{
                desc:weather[0],//ya que es un arreglo de esta forma ingresamos al mismo
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp,
                siente:main.feels_like

            }
            
        } catch (error) {
            console.log(error)
        }

    }

//metodo para agregar a nuestro arreglo

        agregarHistorial(lugar=""){
            //aqui estamos preguntanfo que si el arreglo tiene el elemento si es asi no hace mas nada
                                //el uso de tolocaleLowerCase() es para hacer mas facil las validaciones ya que pone todo en minuscula
            if(this.historial.includes(lugar.toLocaleLowerCase())){
                return;
            }
            //asi solamente mostramos los primeros 5 elementos del arreglo
            this.historial=this.historial.splice(0,5);

            this.historial.unshift(lugar.toLocaleLowerCase());
            //llamamos al metodo de guardarDB
            this.guardarDB()
        }

        guardarDB(){
            //en esta constante almacenamos la informacin del historial completo 
            const payload={
                historial:this.historial
            };                              //el stringify es para convertir los datos en string
            fs.writeFileSync(this.dbPath, JSON.stringify(payload))

        }

        leerDB(){
            //debe existir..
            if(!fs.existsSync(this.dbPath)){
                return null
            }

            //const info leer file
            const info= fs.readFileSync(this.dbPath,{encoding:"utf-8"})
            //const data del json. algo para parsear 
            const data=JSON.parse(info)
            //cargar de la data solamente el historial 
            
           return data.historial
             


        }
        //aqui estamos cargando el historial desde la base de datos para el arreglo 
        //como es una arreglo utilizamos el PUSH
        cargarHistorial(historial=[]){
            historial.forEach(key=>{
                this.historial.push(key)
            })
        }
}

module.exports = Busqueda