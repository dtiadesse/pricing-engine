import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMaterialModule } from './shared/material-module';
import { PricingEngineSharedModule } from './shared/pricing-engine-shared.module';
import { PipelineManagementModule } from './pipeline-management/pipeline-management.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMaterialModule,
    PricingEngineSharedModule,
    PipelineManagementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
