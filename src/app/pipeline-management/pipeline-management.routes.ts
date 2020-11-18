import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PipelineDetailsComponent } from "./pipeline-details/pipeline-details.component";

const routes: Routes = [{ path: "", component: PipelineDetailsComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelineManagementRoutingModule {}
