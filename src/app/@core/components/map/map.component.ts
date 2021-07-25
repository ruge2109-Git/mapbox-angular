import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapaService } from 'src/app/services/mapa.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {


  //Todo lo relacionado al mapa
  private map;

  private jsonDepartamentos;
  private jsonMunicipios;

  private layerDepartamentos;
  private layerMunicipios;
  private layerMunicipioSeleccionado;


  constructor(private mapaService: MapaService) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.iniciarMapa();
    this.trazarDepartamentos();
  }


  iniciarMapa(): void {
    this.map = L.map('map', {
      center: [4.5, -75.3],
      zoom: 5.5
    });

    const tiles = L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  trazarDepartamentos() {
    this.mapaService.obtenerDepartamentos().subscribe((data: any) => {
      this.jsonDepartamentos = data.features;
      this.jsonDepartamentos.forEach(element => {
        element.properties.cantidadProyectos = Math.floor(Math.random() * 40)
      });
      this.trazarDepartamentos2();
    })
  }

  trazarDepartamentos2() {
    this.layerDepartamentos = L.geoJSON(this.jsonDepartamentos, {
      style: this.definirEstiloMapaDepartamentos,
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.onHoverMap(e)),
          mouseout: (e) => (this.onHoverExitMap(e)),
          click: (e) => (this.onClickMapDepartamentos(e))
        })
      )
    });

    this.map.addLayer(this.layerDepartamentos);
    this.layerDepartamentos.bringToBack();
  }

  onHoverMap(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  onHoverExitMap(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  onClickMapDepartamentos(e) {
    const layer = e.target.feature;
    this.map.fitBounds(e.target.getBounds());
    this.map.removeLayer(this.layerDepartamentos);

    this.mapaService.obtenerMunicipios().subscribe((data: any) => {
      this.jsonMunicipios = data.features.filter((municipio)=>{
        if (municipio.properties.DPTO == layer.properties.DPTO) {
          return municipio;
        }
      });

      this.jsonMunicipios.forEach(element => {
        element.properties.cantidadProyectos = Math.floor(Math.random() * 7)
      });

      this.trazarMunicipos();
    })

  }

  onClickMapMunicipios(e){
    const layer = e.target.feature;
    this.map.fitBounds(e.target.getBounds());
    this.map.removeLayer(this.layerMunicipios);

    this.layerMunicipioSeleccionado = L.geoJSON(layer, {
      style: this.definirEstiloMapaMunicipios,
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.onHoverMap(e)),
          mouseout: (e) => (this.onHoverExitMap(e))
        })
      )
    });
    this.map.addLayer(this.layerMunicipioSeleccionado);
  }

  trazarMunicipos(){
    this.layerMunicipios = L.geoJSON(this.jsonMunicipios, {
      style: this.definirEstiloMapaMunicipios,
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.onHoverMap(e)),
          mouseout: (e) => (this.onHoverExitMap(e)),
          click: (e) => (this.onClickMapMunicipios(e))
        })
      )
    });

    this.map.addLayer(this.layerMunicipios);
    this.layerMunicipios.bringToBack();
  }

  definirEstiloMapaDepartamentos(e) {
    let cantidadProyectos = e.properties.cantidadProyectos;
    const color =
      cantidadProyectos>=0 && cantidadProyectos< 7 ? '#ffeda0' :
      cantidadProyectos >= 7 && cantidadProyectos <14 ? '#e8c185' :
      cantidadProyectos >= 14 && cantidadProyectos <21 ? '#d0956c' :
      cantidadProyectos >= 21 && cantidadProyectos <28 ? '#b66b53' :
      cantidadProyectos >= 28 && cantidadProyectos <35 ? '#9c3f3c' :
      '#800026' ;

    return {
      fillColor: color, //this.obtenerColorMapa(e.properties.cantidadProyectos),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  }

  definirEstiloMapaMunicipios(e) {
    let cantidadProyectos = e.properties.cantidadProyectos;
    const color =
      cantidadProyectos>=0 && cantidadProyectos< 1 ? '#ffeda0' :
      cantidadProyectos >= 1 && cantidadProyectos <2 ? '#e8c185' :
      cantidadProyectos >= 3 && cantidadProyectos <3 ? '#d0956c' :
      cantidadProyectos >= 3 && cantidadProyectos <4 ? '#b66b53' :
      cantidadProyectos >= 4 && cantidadProyectos <5 ? '#9c3f3c' :
      '#800026' ;

    return {
      fillColor: color, //this.obtenerColorMapa(e.properties.cantidadProyectos),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  }





}
