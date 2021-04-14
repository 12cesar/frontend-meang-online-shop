import Swal from 'sweetalert2';
import { TYPE_ALERT } from './values.config';

export function basicAlert(icon = TYPE_ALERT.SUCCESS, title: string = '') {
  Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}
