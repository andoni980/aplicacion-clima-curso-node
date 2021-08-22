const inquirer = require( 'inquirer' );
require( 'colors' );

const questions = [ {
    type: 'list',
    name: 'option',
    message: '¿Qué quieres hacer?',
    choices: [ {
        value: 1,
        name: `${ '1.'.green }Buscar ciudad`
    },
    {
        value: 2,
        name: `${ '2.'.green }Historial`
    },
    {
        value: 0,
        name: `${ '0.'.green }Salir`
    }
    ]
} ];

const inquirerMenu = async () => {

    console.clear();
    console.log( '========================='.green );
    console.log( '  Seleccione una opción'.white );
    console.log( '=========================\n'.green );

    const { option } = await inquirer.prompt( questions );

    return option;
};

const pause = async () => {

    const question = [ {
        type: 'input',
        name: 'enter',
        message: `Presione ${ 'ENTER'.green } para continuar`,

    } ];

    await inquirer.prompt( question );
}

const readInput = async ( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate ( value ) {
                if ( value.length === 0 ) {
                    return 'Por favor ingresa un valor';
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt( question );
    return desc;
}

const listLocations = async ( locations = [] ) => {

    const choices = locations.map( ( location, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: location.id,
            name: `${ idx } ${ location.name }`,
        }
    } );

    choices.unshift( {
        value: '0',
        name: '0.'.green + 'Cancelar'
    } );

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecciona lugar ',
            choices
        }
    ]
    const { id } = await inquirer.prompt( questions );
    return id;
}

const confirmDelete = async ( message ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt( question );
    return ok;

}

const showCheckList = async ( tasks = [] ) => {

    const choices = tasks.map( ( task, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: task.id,
            name: `${ idx } ${ task.desc }`,
            checked: ( task.endDate ) ? true : false
        }
    } );

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciona ',
            choices
        }
    ]
    const { ids } = await inquirer.prompt( question );
    return ids;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listLocations,
    confirmDelete,
    showCheckList

}