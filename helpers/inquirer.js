const inquirer = require('inquirer');

const preguntas = [
    {
        type: "list",
        name: "opcion",
        message: "Que desea hacer?",
        choices: [
            {
                value: "1",
                name: `${"1".green}.Buscar Ciudad`
            },
            {
                value: "2",
                name: `${"2".green}.Historial`
            },
           {
                value: "0",
                name: `${"0".green}.Salir`
            }
        ]
    }
]

const inquirerMenu = async () => {
    process.stdout.write("\033c")

    console.log(`${"====================".green}`)
    console.log(`${"Seleccione una opcion".white}`)
    console.log(`${"====================".green}\n`)

    const { opcion } = await inquirer.prompt(preguntas)
    return opcion
}


const pausa = async () => {
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"ENTER".green} para continuar`
        }

    ]

    console.log("\n");

    await inquirer.prompt(question);
}

const leerInput = async (message) => {

    const question = [{

        type: "input",
        name: "desc",
        message,
        validate(value) {//aqui estamos validando q se ingrese un valor
            if (value.length === 0) {
                return "Por favor ingrese un valor"
            }
            return true;
        }
    }]
    const { desc } = await inquirer.prompt(question);

    // en esta linea de codigo estamos llamando al prompt 



    return desc;
    //hacemos el return de desc ya que siendo un objeto es lo que en realidad quiero que me muestre en pantalla luego de ejecutarse 

}

const listarLugares = async (lugares = []) => {


    const choices = lugares.map((lugar, i) => { //con el map transformamos la data que recibimos a lo que queramos
        const idx = `${i + 1}.`.green

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: "0",
        name: "0.".green + "Cancelar"
    });

    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione una ciudad",
            choices //aqui se estan guardando las opcines que son las que definimos con el .map
        }
    ]
    const { id } = await inquirer.prompt(preguntas)
    return id;
}

const seguroBorrar = async (message) => {
    const question = [
        {
            type: "confirm",//el tipo confirm recibe un valor booleano de yes or not 
            name: "answer",
            message
        }

    ]


    const { answer } = await inquirer.prompt(question);
    return answer
}

const mostrarListadoCheckList = async (tareas = []) => {


    const choices = tareas.map((tarea, i) => { //con el map transformamos la data que recibimos a lo que queramos
        const idx = `${i + 1}.`.green

        return {
            value: tarea.id,
            name: `${idx} ${tarea.descripcion}`,
            checked: (tarea.completadoEn) ? true : false  //aqui estamos diciendo que si la tarea esta completada se marque la opcion 
            //el unico cambio con respecto a listar tareas es 
            //que estamos usando el checkbox
        }
    })

   

    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Seleccione",
            choices //aqui se estan guardando las opcines que son las que definimos con el .map
        }
    ]
    const { ids } = await inquirer.prompt(pregunta)
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    seguroBorrar,
    mostrarListadoCheckList,
    listarLugares
}