import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { DocumentNode } from 'graphql';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genre';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { formBasicDialog, optionsWithDetails} from '@shared/alert/alerts';
import { GenresService } from './genres.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constans/title.constans';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;

  constructor(private service: GenresService, private titleService: TitleService) {}
  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.GENRES);
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres',
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#',
      },
      {
        property: 'name',
        label: 'Nombre del Género',
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
    const genre = $event[1];
    // Cogemos el valor por defecto
    const defaultValue = (genre.name !== undefined && genre.name !== '') ? genre.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Teniendo en cuenta el caso, ejecutar una accion
    switch (action) {
      case 'add':
        // Añadir el item
        this.addForm(html);
        break;
      case 'edit':
        // Editar el item
        this.updateForm(html, genre);
        break;
      case 'info':
        // Informacion del item
        const result = await optionsWithDetails(
          'Detalles',
          `${genre.name} (${genre.slug})`,
          350,
          '<i class="fas fa-edit"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear' // fale
        );
        if (result) {
          this.updateForm(html, genre);
        } else if (result === false) {
          this.blockForm(genre);
        }
        break;
      case 'block':
        // Bloquear el item
        this.blockForm(genre);
        break;
      default:
        break;
    }
  }
  private async addForm(html: string)
  {
    const result = await formBasicDialog('añadir un género', html, 'name');
    this.addGenre(result);
    return;
  }
  private addGenre(result) {
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
  private updateGenre(id: string, result) {
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
  private blockGenre(id: string) {
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
  private async updateForm(html: string, genre: any) {
    const result = await formBasicDialog('Modificar género', html, 'name');
    this.updateGenre(genre.id, result);
  }
  private async blockForm(genre: any) {
    const result = await optionsWithDetails(
      '¿Bloquear?',
      `Si bloqueas el item seleccionado no se mostrara en la lista`,
      500,
      'No, no bloquear',
      'Si, bloquear'
    );
    if (result === false) {
      // Si resultado falso queremos bloquear
      this.blockGenre(genre.id);
    }
  }
}
