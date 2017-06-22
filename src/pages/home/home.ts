import { Component } from '@angular/core';
import { NavController , AlertController, LoadingController} from 'ionic-angular';
import { Contacts} from 'ionic-native';
import { PopoverController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
segmento: string = "all";
public ubic_correcta:boolean;
public seleccionadas:boolean;
public cant_seleccionados:number;
public contactos:any;
public numeros: any;
public number: any;
public i: any;
public duplicados_nro:any;
public duplicados_nro2:any;
public duplicados_nom:any;
public selectedname:any;
public selectednumber:any;
public dup_nom:any;
public dup_nro: any;
public pre_contactos: any;
navb: string;



  constructor( public alerCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController) {
      this.inicializar();
      this.obtener_contactos();
      this.colord();
  }

  inicializar(){
    this.pre_contactos = [];
    this.duplicados_nro = [];
    this.duplicados_nro2 = [];
    this.duplicados_nom = [];
    this.selectedname = [];
    this.selectednumber = [];
    this.ubic_correcta = false;
    this.seleccionadas = false;
  }

  colord(){
    this.navb = 'blue';
  }
 
 obtener_contactos(){
    let loader = this.loadingCtrl.create({
    content: 'Please wait...',
  });
      
    loader.present().then(() => {
    Contacts.find(['addresses', 'birthday', 'categories', 'country', 
    'department', 'displayName', 'emails', 'familyName', 'formatted', 
    'givenName', 'honorificPrefix', 'honorificSuffix', 'id', 'ims', 'locality', 
    'middleName', 'name', 'nickname', 'note', 'organizations', 'phoneNumbers', 
    'photos', 'postalCode', 'region', 'streetAddress', 'title', 'urls']).then((res) => {   


      // let res = [{"id":"11","displayName":"alex","phoneNumbers":[{"value":"1234","type":"mobile"}] },
      //             {"id":"30","displayName":"Fernando","phoneNumbers":[{"value":"1234","type":"mobile"}]},
      //             {"id":"30","displayName":"","phoneNumbers":[{"value":"1234","type":"mobile"}]},
      //             {"id":"31","displayName":"Juan","phoneNumbers":[{"value":"8520","type":"mobile"}]},
      //             {"id":"13","displayName":"Anastacio","phoneNumbers":null},
      //             {"id":"12","displayName":"Fernando","phoneNumbers":[{"value":"123456","type":"mobile"}]},
      //             {"id":"15","displayName":"Jose","phoneNumbers":[{"value":"1234567","type":"mobile"}]},
      //             {"id":"16","displayName":"Maria","phoneNumbers":[{"value":"12345678","type":"mobile"}]},
      //             {"id":"13","displayName":"Juan1","phoneNumbers":[{"value":"123456789","type":"mobile"}]},
      //             {"id":"18","displayName":"Jossy1","phoneNumbers":[{"value":"04121903138","type":"mobile"}]},
      //             {"id":"19","displayName":"Jossy","phoneNumbers":[{"value":"04148935201","type":"mobile"}]}];
      
      
      this.pre_contactos = res;
      this.contactos = res.filter((current)=>{
        
        // let counter:number=0;
        // let large1 = current.phoneNumbers.length;
        // current.displayName != null && counter >0
        // if(current.phoneNumbers != null && current.displayName != ""){
          return true;
        // }else{
        //   return false;
        // }
      });
       this.contactos.sort(function(a, b){
            let nameA = a.displayName;
            let nameB = b.displayName;
            if (nameA < nameB){
              return -1;
            } 
            if(nameA > nameB){
              return 1;
            }
              return 0;
         });

      //obtener duplicados por nombre
      this.duplicados_nom = res.filter(function(current) {
          let count:number=0;
          if(current.displayName != null){
            let large1 = res.length;
            for (let k = 0; k < large1; k++) {
              if(res[k].displayName != null){
                if(res[k].displayName == current.displayName){
                  count++;
                }
              }
            }
          }
          if(count>1){
            return true;
          }else{
            return false;
          }
          });


           //obtener duplicados por numero
          this.duplicados_nro = res.filter(function(current) {
          let count:number=0;
          if(current.phoneNumbers != null){
            let large = res.length;
            for (let k = 0; k < large; k++) {
              if(res[k].phoneNumbers != null){
                let large2 = res[k].phoneNumbers.length;
                for (let l = 0; l < large2; l++){
                  if(current.phoneNumbers != null){
                    let large3 = current.phoneNumbers.length;
                    for(let m:number=0; m < large3; m++){
                    if(res[k].phoneNumbers[l].value == current.phoneNumbers[m].value){
                      //if(res[k].id != current.id){
                      //  count++;
                      //}
                        let yup = res[k].id;
                        let tt = current.id.indexOf(yup);
                        if(tt == -1){
                        count++
                      }
                    }
                  }
                }
                }
              }
            }
          }
          return count>0;
          });


      this.dup_nom = this.duplicados_nom.length;
      this.dup_nro = this.duplicados_nro.length;
    });
      });
     loader.dismiss();

  }

  refrescar(refresher){
    setTimeout(() => {
      this.obtener_contactos();
      refresher.complete();
    }, 2000);
  }

  NoneChecked(segmento){
    if(segmento === "name"){
      let count = this.duplicados_nom.length;
      for(let z = 0; z < count; z++){
        if(this.duplicados_nom[z].state == true){
          this.duplicados_nom[z].state = false;
        }
      }
    }

    if(segmento === "number"){
      let count = this.duplicados_nro.length;
      for(let z = 0; z < count; z++){
        if(this.duplicados_nro[z].state == true){
          this.duplicados_nro[z].state = false;
        }
      }
    }
  }

  cant_duplicados(segmento){
    if(segmento === "name"){
      this.ubic_correcta = true;
      if(this.dup_nom > 0){
          let alert = this.alerCtrl.create({
          subTitle: 'Se encontraron ' + this.dup_nom + ' contactos duplicados por nombre.',
          buttons: ['Ok']
          });
          alert.present();
      }else{
        this.ubic_correcta = false;
      }
    }
    if(segmento === "number"){
      this.ubic_correcta = true;
      if(this.dup_nro > 0){
        let alert = this.alerCtrl.create({
          subTitle: 'Se encontraron ' + this.dup_nro + ' contactos duplicados por número.',
          buttons: ['Ok']
          });
          alert.present();
      }else{
        this.ubic_correcta = false;
      }
    }
    if(segmento === "all"){
      this.ubic_correcta = false;
    }

  }

  alerta(segmento){
    let namealert = this.selectedname.length;
    let numberalert = this.selectednumber.length;
    if(segmento == "name"){
    let confirm = this.alerCtrl.create({
      title: 'Eliminar contactos',
      message: '¿Desea eliminar ' +namealert+ ' contactos seleccionados?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.delete(segmento);
          }
        }
      ]
    });
    confirm.present()
  }

    if(segmento == "number"){
      let confirm1 = this.alerCtrl.create({
      title: 'Eliminar contactos',
      message: '¿Desea eliminar ' +numberalert+ ' contactos seleccionados?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.delete(segmento);
          }
        }
      ]
    });
    confirm1.present()
    }
  }

  delete(segmento){
    if(segmento === "name"){
      let large1 = this.selectedname.length;
      for(let q=0; q<large1; q++){
        this.selectedname[q].remove((con) => {alert("Los contactos seleccionados han sido eliminados");}, (error) => {alert("Ha ocurrido el siguente error: "+JSON.stringify(error))});
      }
    }
    if(segmento === "number"){
    let large2 = this.selectednumber.length;
      for(let q=0; q<large2; q++){
        this.selectednumber[q].remove((con) => {alert("Los contactos seleccionados han sido eliminados");}, (error) => {alert("Ha ocurrido el siguente error: "+JSON.stringify(error))});
      }
    }
    this.obtener_contactos();
  }

  CheckAll(event, segmento){
      if(segmento === "name"){
        this.duplicados_nom.forEach(x => x.state = event.target.checked);
      }
      if(segmento === "number") {
        this.duplicados_nro.forEach(x => x.state = event.target.checked);
      }
    }

  isAllChecked(segmento){
      if(segmento === "name"){
        return this.duplicados_nom.every(_ => _.state);
      }
      if(segmento === "number"){
        return this.duplicados_nro.every(_ => _.state);
      }
  }

  isNoneChecked(segmento){
    let dupli:number = 0;
      if(segmento === "name"){
        let large: number = this.duplicados_nom.length;
        for(let p = 0; p < large ; p++){
          if(this.duplicados_nom[p].state == true){
            dupli++;
          }
        }
      }
      if(segmento == "number"){
        let large:number = this.duplicados_nro.length;
        for(let p = 0; p < large; p++){
          if(this.duplicados_nro[p].state == true){
            dupli++;
          }
        }
      }

      if(dupli > 0){
        this.cant_seleccionados = dupli;
        return true;
      }else{
        return false;
      }
  }

  prueba(segmento){
    if(segmento == "name"){
      if(this.dup_nom <= 0){
        return true;
      }else{
       return false;
      }
    }

    if(segmento == "number"){
      if(this.dup_nro <= 0){
        return true;
      }else{
       return false;
      }
    }

  }
    
    getChecked(segmento){
      
      if(segmento == "name"){
        this.selectedname = [];
        let large = this.duplicados_nom.length;
        for(let y=0; y < large; y++){
          let cp = this.selectedname.indexOf(this.duplicados_nom[y].id);
          if(cp == -1){
            if(this.duplicados_nom[y].state === true){
              let tt = this.duplicados_nom[y];        
              this.selectedname.push(tt);

            }
          }
          if(this.duplicados_nom[y].state === false){
              this.selectedname.splice(y,1);
          }     
        }

        if(this.selectedname.length > 0){
           this.navb = 'blue1';
        }else{
          this.navb = 'blue';
        }       

      }

      if(segmento == "number"){
        this.selectednumber = [];
        let large = this.duplicados_nro.length;
        for(let p = 0; p < large; p++){
          let nro = this.selectednumber.indexOf(this.duplicados_nro[p].id);
          if(nro == -1){
            if(this.duplicados_nro[p].state === true){
              let r = this.duplicados_nro[p];
              this.selectednumber.push(r);
            }
          }
          if(this.duplicados_nro[p].state === false){
            this.selectednumber.splice(p,1);
          }
        }

        if(this.selectednumber.length>0){
          this.navb = 'blue1';
        }else{
          this.navb = 'blue';
        }

      }      
    }
}