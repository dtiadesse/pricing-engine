import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";

// Component
import { ButtonComponent } from "./button/button.component";

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  exports: [ButtonComponent],
})
export class ButtonModule {}
