import http from 'k6/http'
import {sleep} from 'k6'

export const options ={
    vus: 15,
    duration: '30s'
}
export default function(){
    const url = 'http://localhost:5000/user/login'
    const body = JSON.stringify({
        email: 'mwai@gmail.com',
        password: 'plokijuhy'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }   
    }

    http.post(url, body, params)


    sleep(1)
}