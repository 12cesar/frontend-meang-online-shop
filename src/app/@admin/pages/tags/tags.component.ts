import { TAG_LIST_QUERY } from '@graphql/operations/query/tag';
import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { DocumentNode } from 'graphql';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { formBasicDialog, optionsWithDetails } from '@shared/alert/alerts';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { TagsAdminService } from './tags-admin.service';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constans/title.constans';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  query: DocumentNode = TAG_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;

  constructor(private service: TagsAdminService, private titleService: TitleService) {}
  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.TAGS);
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'tags',
      definitionKey: 'tags',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre del Tag',
      },
      {
        property: 'slug',
        label: 'Slug',
      },
    ];
  }
  async takeAction($event) {
    // Coger la informacion para las acciones
    const action = $event[0];
    const tag = $event[1];
    // Cogemos el valor por defecto
    const defaultValue = (tag.name !== undefined && tag.name !== '') ? tag.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Teniendo en cuenta el caso, ejecutar una accion
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        // Editar el item
        this.updateForm(html, tag);
        break;
      case 'info':
        // Informacion del item
        const result = await optionsWithDetails(
          'Detalles',
          `${tag.name} (${tag.slug})`,
          350,
          '<i class="fas fa-edit"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear' // fale
        );
        if (result) {
          this.updateForm(html, tag);
        } else if (result === false) {
          this.blockForm(tag);
        }
        break;
      case 'block':
        // Bloquear el item
        this.blockForm(tag);
        break;
      default:
        break;
    }
  }
  private async addForm(html: string)
  {
    const result = await formBasicDialog('añadir un tag', html, 'name');
    console.log(result);
    this.addTag(result);
    return;
  }
  private addTag(result) {
    if (result.value) {
      // tslint:disable-next-line: deprecation
      this.service.add(result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
        return;
      });
    }
    basicAlert(TYPE_ALERT.INFO, 'Se cancelo la operacion');
    return;
  }
  private async updateForm(html: string, tag: any) {
    const result = await formBasicDialog('Modificar tag', html, 'name');
    console.log(tag.id);
    this.updateTag(tag.id, result);
  }
  private updateTag(id: string, result) {
    if (result.value) {
      // tslint:disable-next-line: deprecation
      this.service.update(id, result.value).subscribe((res: any) => {
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
        return;
      });
    }
    basicAlert(TYPE_ALERT.INFO, 'Se cancelo la operacion');
    return;
  }
  private async blockForm(tag: any) {
    const result = await optionsWithDetails(
      '¿Bloquear?',
      `Si bloqueas el item seleccionado no se mostrara en la lista`,
      500,
      'No, no bloquear',
      'Si, bloquear'
    );
    if (result === false) {
      // Si resultado falso queremos bloquear
      this.blockTag(tag.id);
    }
  }
  private blockTag(id: string) {
    // tslint:disable-next-line: deprecation
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
