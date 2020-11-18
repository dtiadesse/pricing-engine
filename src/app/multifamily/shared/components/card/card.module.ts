import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Material
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

// Component
import { CardComponent } from "./card/card.component";

@NgModule({
  declarations: [CardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [CardComponent],
})
export class CardModule {}
