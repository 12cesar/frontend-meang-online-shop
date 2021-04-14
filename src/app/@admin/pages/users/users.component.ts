import { Component, OnInit } from '@angular/core';
import { DocumentNode } from 'graphql';
import { IResultData } from '@core/interfaces/result-data.interface';
import { USER_LIST_QUERY } from '@graphql/operations/query/user';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { optionsWithDetails, userFormBasicDialog } from '@shared/alert/alerts';
import { UsersAdminService } from './users-admin.service';
import { IRegisterForm } from '../../../@core/interfaces/register.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  query: DocumentNode = USER_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  constructor(private service: UsersAdminService){

  }
  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users',
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Nombre'
      },
      {
        property: 'lastname',
        label: 'Apellidos'
      },
      {
        property: 'email',
        label: 'Correo'
      },
      {
        property: 'role',
        label: 'Permisos'
      }
    ];
  }
  private initializeForm(user: any){
    const defaultName = (user.name !== undefined && user.name !== '') ? user.name : '';
    const defaultLastname = (user.lastname !== undefined && user.lastname !== '') ? user.lastname : '';
    const defaultEmail = (user.email !== undefined && user.email !== '') ? user.email : '';
    const roles = new Array(2);
    roles[0] = (user.role !== undefined && user.role === 'ADMIN') ? 'selected' : '';
    roles[1] = (user.role !== undefined && user.role === 'CLIENT') ? 'selected' : '';
    return `
    <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
    <input id="lastname" value="${defaultLastname}" class="swal2-input" placeholder="Apellidos" required>
    <input id="email" value="${defaultEmail}" class="swal2-input" placeholder="Correo Electronico" required>
    <select id="role" class="swal2-input">
      <option value="ADMIN" ${roles[0]}>Administrador</option>
      <option value="CLIENT" ${roles[1]}>Cliente</option>
    </select>
    `;
  }
  async takeAction($event) {
    // Coger la informacion para las acciones
    const action = $event[0];
    const user = $event[1];
    // Cogemos el valor por defecto
    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        // Editar el item
        this.updateForm(html, user);
        break;
      case 'info':
        // Informacion del item
        const result = await optionsWithDetails(
          'Detalles',
          `<i class="fas fa-user-tag"></i>&nbsp;&nbsp ${user.name} ${user.lastname} <br>
          <i class="fas fa-envelope-open-text"></i>&nbsp;&nbsp ${user.email}`,
          500,
          '<i class="fas fa-edit"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear' // fale
        );
        if (result) {
          this.updateForm(html, user);
        } else if (result === false) {
          this.blockForm(user);
        }
        break;
      case 'block':
        // Bloquear el item
        this.blockForm(user);
        break;
      default:
        break;
    }
  }
  private async addForm(html: string)
  {
    const result = await userFormBasicDialog('Añadir Usuario', html);
    console.log(result);
    this.addUser(result);
  }
  private addUser(result){
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      // tslint:disable-next-line: deprecation
      this.service.register(user).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
        return;
      });
    }
  }
  private async updateForm(html:string, user: any){
    const result = await userFormBasicDialog('Modificar Usuario', html);
    console.log(result);
    this.updateUser(result, user.id);
  }
  private updateUser(result, id: string){
    if (result.value) {
      const user = result.value;
      user.id = id;
      console.log(user);
      // tslint:disable-next-line: deprecation
      this.service.update(user).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
        return;
      });
    }
  }
  private async blockForm(user: any) {
    const result = await optionsWithDetails(
      '¿Bloquear?',
      `Si bloqueas el usuario seleccionado no se mostrara en la lista`,
      500,
      'No, no bloquear',
      'Si, bloquear'
    );
    if (result === false) {
      // Si resultado falso queremos bloquear
      this.blockUser(user.id);
    }
  }
  private blockUser(id: string){
    this.service.block(id).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
      return;
    });
  }
}
