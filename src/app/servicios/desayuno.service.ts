import { Injectable } from '@angular/core';
import { desayuno } from '../models/desayuno-interface';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesayunoService {

  private desayunoCollection: AngularFirestoreCollection<desayuno>;

  public currentUser = this.AFauth.auth.currentUser;
  private desayunos: Observable<desayuno[]>;
  public usuarioLog;

  constructor(private db:AngularFirestore, private AFauth : AngularFireAuth, private router: Router) {

    // Revisar este error, de alguna manera se controla aqui
    if(this.currentUser == null){
      console.log("Sin usuario");
      this.router.navigate(['/home']);
    }else if(this.currentUser != null){
      this.usuarioLog = this.currentUser.uid;
    }


    this.desayunoCollection = this.db.collection<desayuno>('platoDesayuno');
    this.desayunos = this.desayunoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
   }


   // ******** METODOS PARA MOSTRAR Y EDITAR EL MENU **********
   // retorna la coleccion
  getTodosDesayunos(){
    return this.desayunos;
  }

  // retorna solo una coleccion
  getDesayunoCollection(id: string){
    return this.desayunoCollection.doc<desayuno>(id).valueChanges();
  }

  updateDesayuno(des :desayuno, id: string){
    return this.desayunoCollection.doc(id).update(des);
  }

  addDesayunos(des: desayuno){
    return this.desayunoCollection.add(des);
  }

  addDesayunoNuevo(des: desayuno) {

    let idPlato = this.db.createId();
    des.id = idPlato;
    return this.db.collection('platoDesayuno').doc(idPlato).set({
      id: idPlato,
      userUID: this.usuarioLog,
      platoDesayuno: des.platoDesayuno,
      estado: "Activo",
      detalleDesayuno: des.detalleDesayuno,
      precioDesayuno: des.precioDesayuno
      // ingredientes: des.ingredientes,
    });
   }

  removerDesayuno(id: string){
    return this.desayunoCollection.doc(id).delete();
  }

  // ******* FIN DE LOS METODOS, VALIDAR SI SE USA LO DEMAS **********



  // Con esto listo la colección
  listar() {
    return this.db.collection<desayuno>('platoDesayuno').valueChanges();
  }

  // updateDesayuno(id: string, menu : desayuno): Promise<void>{
  //   return this.desayunoCollection.doc(id).update(menu);
  // }

  // addDesayuno(menu: desayuno): Promise<DocumentReference>{
  //   return this.desayunoCollection.add(menu)
  // }

  // deleteDesayuno(id: string): Promise<void>{
  //   return this.desayunoCollection.doc(id).delete();
  // }

  getDes(){
    return this.db.collection("platoDesayuno").snapshotChanges().pipe(map(plato => {
      return plato.map(x => {
        const data = x.payload.doc.data() as desayuno;
        data.id = x.payload.doc.id;
        return data;
      })
    }))
  }

  // ********* Metodos para subir el menu *******************

  subirMenu(des: desayuno, id?: string): void{    
    this.guardarDesayuno(des);
  }

  guardarDesayuno(platoDes: desayuno) {

    //this.idRes =perfil.id;
    let idExiste = platoDes.id;
    platoDes.id = idExiste;
    
    if(idExiste){
      const menuDesObj = {
        id: idExiste,
        userUID: this.usuarioLog,
        estado: platoDes.estado,
        platoDesayuno: platoDes.platoDesayuno,
        detalleDesayuno: platoDes.detalleDesayuno,
        precioDesayuno: platoDes.precioDesayuno, 
        ingredientes: platoDes.ingredientes
      };
      return this.desayunoCollection.doc(platoDes.id).update(menuDesObj);      
    }else{      
      let idPlato = this.db.createId();
      platoDes.id = idPlato;
      this.db.collection('platoDesayuno').doc(idPlato).set({
        id: platoDes.id,
        userUID: this.usuarioLog,
        estado: 'Activo',
        platoDesayuno: platoDes.platoDesayuno,
        detalleDesayuno: platoDes.detalleDesayuno,
        precioDesayuno: platoDes.precioDesayuno, 
        ingredientes: platoDes.ingredientes
      });
    }
  }

}
