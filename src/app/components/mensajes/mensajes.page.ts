import { resta } from './../../models/restaurante-interface';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReservasService } from '../../servicios/reservas.service';
import { Reserva } from '../../models/reserva-interface';
import { Observable } from 'rxjs';
import { RestaurantesService } from '../../servicios/restaurantes.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, private router:Router, private restauranteSvc: RestaurantesService,
    private authservice: AuthService, private AFauth : AngularFireAuth, private reservasService : ReservasService) { }

    public usuarioLog:string;
    public reservas : any = [];
    public valorReserva: boolean =true;

    public reservas$: Observable<Reserva[]>;
    public restaurante$: Observable<resta[]>;

  ngOnInit() {

    //this.reservasService.getReservas().subscribe(data =>{
    //  this.reservas = data
    //})

    this.reservas$ = this.reservasService.recuperarDatos()
    this.restaurante$ = this.restauranteSvc.recuperarDatos()

    try {
      let currentUser = this.AFauth.auth.currentUser;
      this.usuarioLog = currentUser.uid;
      
    } catch (error) {
      console.log(error)
    }

    // this.sinReserva();

  }

  // Aun no funciona
  sinReserva(){
    this.reservasService.listar().subscribe(data =>{
      console.log("reservas", data);
      console.log("reservas", this.usuarioLog);
      for(let reserva of data){
        if(this.usuarioLog === reserva.uidUsu){
          console.log("si existe");
          break;
        }else if(this.usuarioLog != reserva.uidUsu && reserva.uidUsu){
          console.log("no");
          this.valorReserva = false; 
        }
      }
      this.validarReserva(this.valorReserva)
      console.log(this.validarReserva(this.valorReserva));
    })
  }

  // metodo para cambiar el estado de la variable
  validarReserva(valor: boolean){
    if (valor){
      return true;
    }else{
      return false;
    }
  }

  goRegreso(){
    this.router.navigate(['/listado'])
  }

  onLogout(){
    this.authservice.logout();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Cerrar Sesion',
        icon: 'log-out',
        handler: () => {
         this.onLogout();
        }
      }]
    });
    await actionSheet.present();
    let result = await actionSheet.onDidDismiss();
  }

}
