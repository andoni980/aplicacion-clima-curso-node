const fs = require( 'fs' );

const axios = require( 'axios' );

class Searches {

    history = [];
    dbPath = './DB/database.json'

    constructor() {
        this.readDB();
    }

    get capitalizedHistory () {
        return this.history.map( location => {
            let words = location.split( ' ' );
            words = words.map( p => p[ 0 ].toUpperCase() + p.substring( 1 ) );

            return words.join( ' ' );
        } );
    }

    get paramsMapBox () {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsOpenWeather () {

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'

        }
    }

    async city ( location = '' ) {

        try {

            // Peticion http

            const instance = axios.create( {
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ location }.json`,
                params: this.paramsMapBox
            } );

            const resp = await instance.get();
            return resp.data.features.map( location => ( {
                id: location.id,
                name: location.place_name,
                lng: location.center[ 0 ],
                lat: location.center[ 1 ],
            } ) );

        } catch ( error ) {

            return [];
        }
    }

    async weather ( lat, lon ) {

        try {
            const instance = axios.create( {
                baseURL: `http://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsOpenWeather, lat, lon }

            } );
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[ 0 ].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp

            };

        } catch ( error ) {
            console.log( error );
        }

    }

    saveHistory ( location = '' ) {

        if ( this.history.includes( location.toLocaleLowerCase() ) ) {
            return;
        }
        this.history = this.history.splice( 0, 5 );

        this.history.unshift( location.toLocaleLowerCase() );

        this.saveDB();

    }

    saveDB () {

        const payLoad = {
            history: this.history
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payLoad ) );
    }

    readDB () {

        if ( !fs.existsSync( this.dbPath ) ) {
            return;
        }

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );

        this.history = data.history;
    }
}

module.exports = Searches;