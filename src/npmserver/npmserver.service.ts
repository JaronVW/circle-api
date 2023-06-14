import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NpmserverService {
    constructor(private readonly httpService: HttpService) {}

    async fetchData(): Promise<Response[]> {
        const response = await axios.get('http://127.0.0.1:9997/v2/paths/list');
        return response.data;
    }
}
