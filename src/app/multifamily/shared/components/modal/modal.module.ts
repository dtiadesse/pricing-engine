import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

// Component
import { ModalComponent } from "./modal/modal.component";

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [ModalComponent],
})
export class ModalModule {}
