import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Component
import {
  ButtonModule,
  ModalModule,
} from "../../../multifamily/shared/components";
import { MatIconModule } from "@angular/material/icon";

import { StatusDialogComponent } from "./status.modal.component";
import { MatDialogModule } from "@angular/material/dialog";
@NgModule({
  declarations: [StatusDialogComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ModalModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [StatusDialogComponent],
})
export class StatusDialogModule {}
