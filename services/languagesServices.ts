import axios from 'axios';


class LanguagesService {

  private http = axios.create({
    baseURL: 'https://www.localeplanet.com/api/auto/langmap.json'
  });


  getAll() {
    return this.http.get<object>('');
  }
}


export default new LanguagesService();
