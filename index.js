require( 'dotenv' ).config();

const { readInput, inquirerMenu, pause, listLocations } = require( "./helpers/inquirer" );
const Searches = require( "./models/searches" );

// console.log( process.env.MAPBOX_KEY );

const main = async () => {

    const searches = new Searches();

    let opt;

    do {

        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                // Mostrar mensaje
                const term = await readInput( 'Ciudad:' );

                // Buscar lugares
                const locations = await searches.city( term );

                // Seleccion del lugar por el usuario 
                const idSelected = await listLocations( locations );
                if ( idSelected === '0' ) continue;

                // Guardar en DB
                const locationSelected = locations.find( l => l.id === idSelected );

                searches.saveHistory( locationSelected.name );

                // Clima
                const weatherData = await searches.weather( locationSelected.lat, locationSelected.lng );

                // Mostrar resultados
                console.clear();
                console.log( '\nInformación de la ciudad\n'.green );
                console.log( 'Ciudad:', locationSelected.name.green );
                console.log( 'Lat:', locationSelected.lat );
                console.log( 'Lng:', locationSelected.lng );
                console.log( 'Temperatura:', weatherData.temp );
                console.log( 'Mínima:', weatherData.min );
                console.log( 'Máxima:', weatherData.max );
                console.log( 'Descripción:', weatherData.desc.green );

                break;
            case 2:
                searches.capitalizedHistory.forEach( ( location, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ location }` );


                } );

                break;

        }

        if ( opt !== 0 ) await pause();

    } while ( opt !== 0 );
}

main();