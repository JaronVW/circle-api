import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NpmserverService {
    constructor(private readonly httpService: HttpService) {}

    async fetchData(): Promise<Response[]> {
        const response = await axios.get('http://localhost:8000/api/streams');
        return response.data;
    }
}
