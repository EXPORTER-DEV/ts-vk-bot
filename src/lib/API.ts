import axios from "axios";
const qs = require('qs');

export interface IApiUser {
    user_id: number,
    first_name: string,
    last_name: string,
}

export class ApiUser implements IApiUser {
    user_id: number;
    first_name: string;
    last_name: string;
    constructor(data: IApiUser){
        this.user_id = data.user_id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
    }
}

export default class API {
    private access_token: string;
    constructor(access_token: string){
        this.access_token = access_token;
    }
    private readonly version: string = '5.131';
    private async fetch(api_method: string, data: Record<string, any>): Promise<any>{
        return axios({
            url: api_method,
            method: 'POST',
            baseURL: 'https://api.vk.com/method/',
            data: qs.stringify({
                ...data,
                access_token: this.access_token,
                v: this.version
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
    async getUser(user_id: number): Promise<false | ApiUser> {
        const response = await this.fetch('users.get', {
            user_ids: [user_id],
        }).then((res) => res.data).catch((e) => false);
        if(response && response.response && response.response.length > 0){
            const user = response.response[0];
            return new ApiUser({
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name
            });
        }
        return false;
    }
}