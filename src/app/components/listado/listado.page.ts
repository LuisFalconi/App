import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { RestaurantesService, } from '../../servicios/restaurantes.service';
import { ModalController } from '@ionic/angular';
import { PerfilResComponent } from '../perfil-res/perfil-res.component';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { promos } from '../../models/promos-interface';
import { resta } from '../../models/restaurante-interface';

import { almuerzo } from '../../models/almuerzo-interface';
import { desayuno } from '../../models/desayuno-interface';

import { AlmuerzoService } from '../../servicios/almuerzo.service'
import { MeriendaService } from '../../servicios/merienda.service'
import { MenuService } from '../../servicios/menu.service'
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { PromocionService } from '../../servicios/promocion.service';

import { PerfilesService } from '../../servicios/perfiles.service'
import { especial } from '../../models/especial-interface';
import { DesayunoService } from '../../servicios/desayuno.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {

  // public Restaurantes : resta[]
  restaurante$: Observable<resta[]>;
  resHabilitados: resta[] = []; 
  resHabilitados2: resta[] = []; 


  // busqueda
  public resList: any[];


  public Promos : promos[]
   

  promociones$: Observable<promos[]>;
  promociones: promos;

  public usuarioLog : string

  listPromo: any[] = [];

  promoL: promos[] = [];
  promoLO: Observable<promos[]>;


  public desayunos : desayuno[]
  public almuerzos: almuerzo[]
  public especial: especial[]


  constructor(private authservice: AuthService, public restaurantesService: RestaurantesService,
    private modal: ModalController, public actionSheetController: ActionSheetController,
    private router:Router, private AFauth : AngularFireAuth, private desayunoService : DesayunoService, private especialService: MeriendaService,
    private almuerzoService : AlmuerzoService, private promocionesService: PromocionService,
    private perfilService : PerfilesService, private firestore: AngularFirestore) { }

  async ngOnInit() {

    this.resList = await this.initializeItems();

    

    let currentUser = this.AFauth.auth.currentUser;
    this.usuarioLog = currentUser.uid;



    this.perfilService.getUsuario(this.usuarioLog).subscribe(data =>{
      if(data.roles === "dueño"){
        this.router.navigate(['/perfil'])
      }
    })

    this.restaurante$ = this.restaurantesService.recuperarDatos();
    this.promociones$ = this.promocionesService.recuperarDatos();


    // De esta manera evito poner los NgIf en el HTML
    this.restaurantesService.listar().subscribe(x =>{
      this.resHabilitados = []
      x.forEach(element => {
        if(element['resVerificado'] === 'Aprobado'){
          console.log("xxx", element);
          this.resHabilitados.push(element)
        }else{
          console.log("no", element);
        }
      });
      console.log("array", this.resHabilitados);
      
    })

    this.resHabilitados = await this.initializeItems();


    

    // this.promocionesService.listar().subscribe(data =>{
    //   console.log(data);
    //   const contador = 0;
    //   for(let pro of data){
    //     console.log(pro);
    //   }
      
    // })

    this.getPromos();
    
    
    // this.restaurantesService.getResta().subscribe( resta => {
    //   this.Restaurantes = resta;
    //   console.log("resta:", resta); 
    // })

    // this.restaurantesService.getPromos().subscribe(promo => {
    //   this.Promos = promo;
    // })

    this.desayunoService.listar().subscribe(desa => {
      this.desayunos = desa;
    })
    
    this.almuerzoService.listar().subscribe(almu =>{
      this.almuerzos = almu;
    })

    this.especialService.listar().subscribe(espe => {
      this.especial = espe;
    })

    this.restaurantesService.restaurantesHabilitados();
    console.log("SADDSADSA", this.restaurantesService.restaurantesHabilitados());
    





    // this.meriendaService.getMeri().subscribe(meri => {
    //   this.meriendas = meri
    // })

  }

  async initializeItems(): Promise<any> {

    
    const restaList = await this.firestore.collection('perfiles')
      .valueChanges().pipe(first()).toPromise();
      console.log("que es esto", restaList);
      this.resHabilitados2 = []
      restaList.forEach(element => {
        if(element['resVerificado'] === 'Aprobado'){
          console.log("xxx", element);
          this.resHabilitados2.push(element)
        }else{
          console.log("no", element);
        }
      
      });
      console.log("aaa", this.resHabilitados2);
      
      return this.resHabilitados2;

      
  }

  async filterList(evt) {
    this.resList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.resList = this.resList.filter(Food => {
      if (Food.nombreRestaurante && searchTerm) {
        return (Food.nombreRestaurante.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || Food.tipoRestaurante.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1  );
      }
    });
  }

  async filterList2(evt) {
    this.resHabilitados = await this.initializeItems();
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.resHabilitados = this.resList.filter(currentFood => {
      if (currentFood.nombreRestaurante && searchTerm) {
        return (currentFood.nombreRestaurante.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || currentFood.tipoRestaurante.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  restaurantesHabilitados(){
    this.resHabilitados = [];
    this.restaurantesService.recuperarDatos()
      .subscribe(
        data =>{
          for(let key$ in data){
            let habilitados = data[key$];
            if(habilitados['resVerificado'] === 'Aprobado'){
              this.resHabilitados.push(habilitados);
            }
          }
          this.resHabilitados2 = this.resHabilitados;
        }
      )
  }



  openRes(res){
    this.modal.create({
      component: PerfilResComponent,
      componentProps : {
        res: res,
        desayuno: this.desayunos,
        almuerzo: this.almuerzos,
        especial: this.especial,
        
      }
    }).then((modal) => modal.present())
  }

  onLogout(){
    this.authservice.logout();
  }

  verMas(){
    this.router.navigate(['/lista-promociones-habilitadas']);
  }

  getPromos(){
    this.promoL =[];

    this.promocionesService.listar().subscribe(data =>{
      let i = 0;
      for (let key$ in data){ 
        let promos = data[key$];
        console.log("lleng", data.length);
        if(promos['estado'] === "verdadero" && i < 10){
          this.promoL.push(promos)
        }else{
        }
        i  = i + 1;
        console.log();
      }
      console.log("a ver", this.promoL);

    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Mi Perfil',
        icon: 'person',
        handler: () => {
          this.router.navigate(['/perfil'])
        }
      },{
        text: 'Restaurantes Afiliados',
        icon: 'restaurant',
        handler: () => {
          this.router.navigate(['/restaurantes-afiliados'])
        }
      },{
        text: 'Promociones',
        icon: 'gift',
        handler: () => {
          this.router.navigate(['/lista-promociones-habilitadas'])
        }
      },{
        text: 'Mensajes',
        icon: 'mail',
        handler: () => {
          this.router.navigate(['/mensajes'])
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
    let result = await actionSheet.onDidDismiss();
  }

}
