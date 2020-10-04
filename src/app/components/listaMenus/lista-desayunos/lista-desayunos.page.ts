import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { DesayunoService } from '../../../servicios/desayuno.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { desayuno } from '../../../models/desayuno-interface';

@Component({
  selector: 'app-lista-desayunos',
  templateUrl: './lista-desayunos.page.html',
  styleUrls: ['./lista-desayunos.page.scss'],
})
export class ListaDesayunosPage implements OnInit {

  public currentUser = this.AFauth.auth.currentUser;

  desayuno: desayuno = {
    platoDesayuno: '',
    detalleDesayuno: '',
    precioDesayuno: ''
    // ingredientes: [],
  };

  desayunoID = null;

  constructor(private route: ActivatedRoute, private nav: NavController, private desayunoSVC: DesayunoService, private loadingController: LoadingController
    ,private AFauth : AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.desayunoID = this.route.snapshot.params['id'];
    if (this.desayunoID){
      console.log("mmmmm si?", this.desayunoID);
      
      this.loadDesayuno();
      console.log("que es esto", this.loadDesayuno() );
      
    }else{
      console.log("mmmm");
      
    }
  }

  async loadDesayuno(){
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();

    this.desayunoSVC.getDesayunoCollection(this.desayunoID).subscribe(des => {
      console.log("des", des);
      
      loading.dismiss();
      this.desayunoID = des;
    });
  }

  async saveDesayuno() {
    const loading = await this.loadingController.create({
      message: 'Saving....'
    });
    await loading.present();
 
    if (this.desayunoID) {
      this.desayunoSVC.updateDesayun(this.desayuno, this.desayunoID).then(() => {
        loading.dismiss();
      this.router.navigate(['tabs-menu/desayuno'])
      });
    } else {
      
      this.desayunoSVC.addDesayunoNuevo(this.desayuno).then(() => {
        loading.dismiss();
        this.router.navigate(['tabs-menu/desayuno'])

      });
    }
  }
  async onRemoveDesayuno(idDes:string) {
    const loading = await this.loadingController.create({
      message: 'eliminando....'
    });
    await loading.present();
    this.desayunoSVC.removerDesayuno(idDes);
    loading.dismiss();
    this.router.navigate(['tabs-menu/desayuno'])
  }

}
