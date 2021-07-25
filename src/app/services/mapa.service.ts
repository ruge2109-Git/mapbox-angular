import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private http:HttpClient) { }

  obtenerDepartamentos(){
    // return this.http.get('https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json');
    return this.http.get('./assets/colombiaDepto.geo.json');
  }

  obtenerMunicipios(){
    // return this.http.get('https://gist.githubusercontent.com/nestorandrespe/1b87fc08bc60431a1c3363e318cad02d/raw/41d0e4e9686e5953ddeb5b1c7a2e3562df199edd/mpios.json');
    return this.http.get('./assets/colombiaMuni.geo.json');
  }

}
