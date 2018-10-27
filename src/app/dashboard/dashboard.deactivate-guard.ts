import { DashboardComponent } from './dashboard.component';
import { CanDeactivate } from '@angular/router';

export class DashBoardDeactivateGuard implements CanDeactivate<DashboardComponent> {

  canDeactivate(component: DashboardComponent) {
    return component.canDeactivate();
  }
}
