import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Routing
import { PipelineManagementRoutingModule } from "../pipeline-management/pipeline-management.routes";

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";

// Shared
import {
  ButtonModule,
  CardModule,
  ModalModule,
  PageTitleSectionModule,
} from "../multifamily/shared/components/index";

// Components
import { StatusDialogComponent } from "../shared/components/status-modal/status.modal.component";
import { PipelineDetailsComponent } from "./pipeline-details/pipeline-details.component";
import { MatCardModule } from "@angular/material/card";
import { PricingEngineSharedModule } from "../shared/pricing-engine-shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
@NgModule({
  declarations: [PipelineDetailsComponent],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule,
    ModalModule,
    MatListModule,
    PageTitleSectionModule,
    PricingEngineSharedModule,
    PipelineManagementRoutingModule,
  ],
  entryComponents: [StatusDialogComponent],
})
export class PipelineManagementModule {}
