import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AdService } from '../../services/ad.service';
import { SessionService } from "../../services/session";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-ad-edit',
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.css']
})
export class AdEditComponent implements OnInit {
  ad;
  user;
  canEdit: boolean = false;
  
  oldCity: string;
  oldQuantity: string;
  oldHave: string;
  oldWant: string;
  oldComment: string;
  submit = false; //esto es para el canDeactivate 

  currencies = ["EUR","USD","AUD","CNY","KRW","CAD","JPY","GBP","PKR","INR"];
  maxLength = 40;  //máximo caracteres para comentarios.

  constructor(
    private sessionService: SessionService,
    private adService: AdService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.adService.get(params.id).subscribe(ad => {
        this.ad = ad;
        this.sessionService.isLogged().subscribe(user => {  
          this.user = user;
          if (this.user._id == this.ad.creator._id) this.canEdit = true; //si el usuario coincide con el creador del anuncio puede editar
        })
      });
    });
   }

  ngOnInit() {
    setTimeout(() => { // evitar que me de error al correr la función de setInitial antes de que haya cargado las variables (ngAfterViewInit no funciona)
      this.setInitial()
    }, 250);
  }

  setInitial() {  // guardo los valores iniciales en las variables old para compararlo después en el canDeactivate
    this.oldCity = this.ad.city;
    this.oldQuantity = this.ad.quantity;
    this.oldHave = this.ad.have;
    this.oldWant = this.ad.want;
    this.oldComment = this.ad.comment;
  }

  edit(ad) {
    this.submit = true;  //para evitar que salga la ventana canDeactivate cuando pincho en save
    this.adService.edit(this.ad).subscribe(ad => {
      this.ad = ad;
      this.router.navigate(['/ad',ad._id]);
    })
  }

  canDeactivate() { //saltará cuando alguno de los campos haya sido modificado y quiera salir de la página
    console.log('I am navigating away');
    if (this.submit === false && (this.oldCity !== this.ad.city || this.oldHave !== this.ad.have ||
    this.oldWant !== this.ad.want || this.oldQuantity !== this.ad.quantity || 
    this.oldComment !== this.ad.comment)) {
    return window.confirm("Are you sure you want to discard your changes?");
    }
    return true;
    }
}
