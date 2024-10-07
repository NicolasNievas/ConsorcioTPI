import { Routes } from '@angular/router';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    
        { path: 'employee/update/:id', component: UpdateEmployeeComponent },
        { path: 'employee/list', component: ListEmployeeComponent },
        { path: 'employee/create', component: CreateEmployeeComponent },
        
        { path: '', redirectTo: '/employees/list', pathMatch: 'full' }, // Ruta predeterminada
        { path: '**', component: NotFoundComponent }
    
];
