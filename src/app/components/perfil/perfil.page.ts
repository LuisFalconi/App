import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../servicios/auth.service';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public usuarios$: Observable<Usuario[]>;
  

  public usuarioLog:string;
  public UsuarioRoles: Usuario[];

  public rolActual: string[];

  public perfil : any = [];
  public perfilID:Usuario[];

  public numero:string;
  public nombre:string;


  constructor( private authservice: AuthService, private actionSheetController : ActionSheetController,
    private router: Router, private AFauth : AngularFireAuth, private db:AngularFirestore ) { }

  ngOnInit() {

    this.usuarios$ = this.authservice.recuperarDatos();
    
    let currentUser = this.AFauth.auth.currentUser;
    this.usuarioLog = currentUser.uid;

  }

  onLogout(){
    this.authservice.logout();
  }

  getMenu(){

    let currentUser = this.AFauth.auth.currentUser;
    this.usuarioLog = currentUser.uid;

    this.authservice.getUsuario().subscribe(data =>{
      data.forEach((usuario: Usuario) => {

        if (this.usuarioLog == usuario.uid){
          this.UsuarioRoles = [usuario]
          for(let user of this.UsuarioRoles){
            this.rolActual = user.roles
            this.presentActionSheet(this.rolActual.toString())
          }
        }
      })
    })
  }

 async presentActionSheet(rol :string) {
    
  if( rol == 'dueño'){
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Editar Perfil',
        icon: 'settings',
        handler: () => {
          this.router.navigate(['/reserva']);
        }
      }, {
        text: 'Visualizar Peticiones',
        icon: 'eye',
        handler: () => {
          this.router.navigate(['/reserva']);
        }
      }, {
        text: 'Actualizar Menu',
        icon: 'refresh-circle',
        handler: () => {
          this.router.navigate(['/menu']);
        }
      },{
        text: 'Cerrar Sesion',
        icon: 'log-out',
        handler: () => {
         this.onLogout();
        }
      }]
    });
    await actionSheet.present();
  }else if (rol = 'cliente'){
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Restaurantes',
        icon: 'restaurant',
        handler: () => {
          this.router.navigate(['/listado']);
        }
      },{
        text: 'Editar Perfil',
        icon: 'settings',
        handler: () => {
          this.router.navigate(['/actualizar-perfil'])
        }
      }, {
        text: 'Cerrar Sesion',
        icon: 'log-out',
        handler: () => {
         this.onLogout();
        }
      }]
    });
    await actionSheet.present();
  }
}

}
