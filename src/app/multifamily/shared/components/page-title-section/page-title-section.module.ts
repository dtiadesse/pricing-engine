import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

// Material
import { MatIconModule } from "@angular/material/icon";

// Component
import { PageTitleSectionComponent } from "./page-title-section/page-title-section.component";

@NgModule({
  declarations: [PageTitleSectionComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [PageTitleSectionComponent],
})
export class PageTitleSectionModule {}
