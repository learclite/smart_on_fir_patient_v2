import {Cookie} from "./helpers.js";
import {clientId, redirectUri} from './config.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);

const fhirUrl = urlParams.get('iss')

Cookie.set('fhir_url', fhirUrl, {secure: true, "max-age": 3600})

const launchId = urlParams.get('launch')

async function getWellKnown() {
    let response = await fetch(fhirUrl + '/.well-known/smart-configuration', {
        headers: {
            Accept: 'application/json'
        }
    })

    return await response.json()
}

function authorize(data) {
    //.replace
    let authEndpoint = data.authorization_endpoint;
    let token_endpoint = data.token_endpoint;
    Cookie.set('token_endpoint', token_endpoint, {secure: true, "max-age": 3600})

    debugger;

    let auth_location = `${authEndpoint}?` +
        "response_type=code&" +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURI(redirectUri)}&` +
        `launch=${launchId}&` +
        "scope=patient%2FObservation.read%20launch%20fhirUser&" + //if we specify scopes that are not registered for our app, we get an invalid_grant error
        "state=98wrghuwuogerg97&" +
        `aud=${fhirUrl}`
    location.assign(auth_location) // ~ redirect to auth_location
}


getWellKnown().then((data) => {
    authorize(data)
}).catch((err) => {
    debugger
    console.log('error fetching well-known')
})



