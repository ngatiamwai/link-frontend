import http from 'k6/http'
import {sleep} from 'k6'

export const options ={
    stages: [
        { duration: '2m', target: 2000 },
        
        {duration: '1m', target: 0}
    ]
}
export default function(){
    const url = 'http://localhost:5000/user/login'
    const body = JSON.stringify({
        email: 'mwai@gmail.com',
        password: '123456789'
    })

    const params = {
        headers: {
            "Content-Type": "application/json",
            "application-type": "application/json",
        }   
    }

http.post(url, body, params)


    sleep(1)
}