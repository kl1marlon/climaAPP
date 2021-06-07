require("dotenv").config()

require("colors");
const { leerInput,inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busqueda = require("./models/busqueda");

const main=async()=>{
    let opt
   
    const busqueda=new Busqueda()
    const leerDB=busqueda.leerDB();
    if(leerDB){
        busqueda.cargarHistorial(leerDB)
    }
    do {
        opt=await inquirerMenu();
        
        switch (opt) {
            case "1":
           
            const termino=await leerInput("Indique la ciudad a buscar: ");
            
            
            const lugares= await busqueda.ciudad(termino); 
            
        
            const id = await listarLugares(lugares) ;
            
            if(id==="0") continue;

           
            
            const lugarSel=lugares.find(l=> l.id===id);
                                           
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
        
            
           

                break;
        
            case "2":
               
                busqueda.historial.forEach((lugar,i)=>{
                    const idx =`${i+1}.`.green;  
                    console.log(`${idx} ${lugar.replace(/\b[a-z]/g, (x) => x.toUpperCase())}`)
                })
                
               
                break;
        }

        if(opt!=0)await pausa()
    } while (opt!=0);
}


main()