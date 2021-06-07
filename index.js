require("dotenv").config()

require("colors");
const { leerInput,inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busqueda = require("./models/busqueda");
//console.log(process.env.OPENWEATHER_KEY)

//console.log(process.env.MAPBOX_KEY)
const main=async()=>{
    let opt
   
    const busqueda=new Busqueda()
    const leerDB=busqueda.leerDB();
    if(leerDB){//si existe el historial mando a que se cargue el mismo en el arreglo creado 
        busqueda.cargarHistorial(leerDB)
    }
    do {
        opt=await inquirerMenu();
        
        switch (opt) {
            case "1":
            //Mostrar mensaje           //mensaje que se muestra
            const termino=await leerInput("Indique la ciudad a buscar: ");
            //guardamos en termino la informacion que viene del await leerInput
            
            const lugares= await busqueda.ciudad(termino); 
            //guardamos en lugares la infomacion que viene en busqqueda.ciudad(termino)
        
            const id = await listarLugares(lugares) ;
            
            if(id==="0") continue;

           
            //listamos los lugares con el termino establecido
            const lugarSel=lugares.find(l=> l.id===id);
                                            //esta retornando la informacion del id seleccionado
             //guardar en db
             busqueda.agregarHistorial(lugarSel.nombre)
        
                                            
            const clima=await busqueda.clima(lugarSel.latitud,lugarSel.longitud)
            
            
            console.clear()
            console.log("\nInformacion de la ciudad\n".green)
            console.log("Ciudad:".white, lugarSel.nombre)
            console.log("Latitud".white, lugarSel.latitud)
            console.log("Longitud".white, lugarSel.longitud)
            console.log("Temperatura".white,clima.temp)
            console.log("Minima".white,  clima.min)
            console.log("Maxima".white, clima.max)
            console.log("Como esta el clima".white, clima.desc.description)
        
            
            //clima.desc.description para tener la informacion de la nubosidad
            //mostrar resultados
            

                break;
        
            case "2":
                //hacemos un foreach para recorrer el arreglo
                
                busqueda.historial.forEach((lugar,i)=>{
                    const idx =`${i+1}.`.green; //ESTA LINEA DE CODIGO ESTOY CAPITALIZANDO SOLO LA PRIMERA LETRA 
                    console.log(`${idx} ${lugar.replace(/\b[a-z]/g, (x) => x.toUpperCase())}`)
                })
                /*
                DIOS BENDIGA A STACKOVERFLOW
                let result =
                'this is very interesting'.replace(/\b[a-z]/g, (x) => x.toUpperCase())

                console.log(result) 
                */
               
                break;
        }

        if(opt!=0)await pausa()
    } while (opt!=0);
}


main()