import { Component, OnInit } from '@angular/core';
import { DesayunoService } from '../../../servicios/desayuno.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { desayuno } from '../../../models/desayuno-interface';
import { EditarDesayunoComponent } from '../../editar-menu/editar-desayuno/editar-desayuno.component';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { resta } from '../../../models/restaurante-interface';
import { RestaurantesService } from '../../../servicios/restaurantes.service';

@Component({
  selector: 'app-menu-desayuno',
  templateUrl: './menu-desayuno.page.html',
  styleUrls: ['./menu-desayuno.page.scss'],
})
export class MenuDesayunoPage implements OnInit {

  desayunos: desayuno[];
  desayunoUser: desayuno[] = [];
  restaUser: resta[] = []
  restaurantes: resta[]
  public restaurante$: Observable<resta[]>;



  public usuarioLog:string;
  public currentUser = this.AFauth.auth.currentUser;

  constructor(private desayunoService: DesayunoService, private AFauth : AngularFireAuth, 
    private router:Router, private restauranteService : RestaurantesService ,
    private modal: ModalController) { }

  ngOnInit() {

      // para listar en el modal
      this.restaurante$ = this.restauranteService.recuperarDatos();
      this.desayunoService.listar().subscribe(des => {
        this.desayunos = des;
    })

    this.restauranteService.listar().subscribe(res =>{
      this.restaurantes = res;
    })

  
    if(this.currentUser != null){
      this.usuarioLog = this.currentUser.uid;
    }else{
      console.log("No hay un usuariio logueado");
      this.router.navigate(['/listado']);
    }

    this.desayunoService.listar().subscribe((alm) =>{
      console.log('Todoss', alm);
      this.desayunoUser = [];
      alm.forEach(element => {
        if(element['userUID'] === this.usuarioLog){
          this.desayunoUser.push(element)
        }
      });
    })

    this.restauranteService.listar().subscribe((res) =>{
      console.log('Todoss', res);
      this.restaUser = [];
      res.forEach(element => {
        if(element['userUID'] === this.usuarioLog){
          this.restaUser.push(element)
          console.log("aver " +  this.restaUser)
        }
      });
    })

  }

  openDes(des){
    this.modal.create({
      component: EditarDesayunoComponent,
      componentProps : {
        des: des,
        desayunos: this.desayunos,
      }
    }).then((modal) => modal.present())
  }

  onRemove(idDesayuno :string){
    this.desayunoService.removerDesayuno(idDesayuno);
    
  }

}
