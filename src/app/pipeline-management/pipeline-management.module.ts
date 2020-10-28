import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { PipelineManagementRoutingModule } from './pipeline-management.routes'

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipelineDetailsComponent } from './pipeline-details/pipeline-details.component';
import { PricingEngineSharedModule } from '../shared/pricing-engine-shared.module';
import { MatMaterialModule } from '../shared/material-module';

import { MatIconModule } from '@angular/material/icon';

import { MatMenuModule } from '@angular/material/menu';
@NgModule({
    declarations: [
        PipelineDetailsComponent
    ],
    imports: [
        CommonModule,
        MatMaterialModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTabsModule,
        MatTooltipModule,

        PricingEngineSharedModule,
        PipelineManagementRoutingModule
    ],

})
export class PipelineManagementModule { }
