import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatIconModule } from "@angular/material/icon";
import { CustomTooltipDirective } from "../../../shared/components/custom-tooltip/directive/custom-tooltip-directive";
import { ToolTipTemplateComponent } from "../../components/custom-tooltip/components/tooltip-template/tooltip-template";
import { CustomTooltipComponent } from "./components/custom-tooltip/custom-tooltip.component";

@NgModule({
  declarations: [
    CustomTooltipDirective,
    ToolTipTemplateComponent,
    CustomTooltipComponent,
  ],
  imports: [CommonModule, MatIconModule],
  entryComponents: [ToolTipTemplateComponent],
  exports: [
    CustomTooltipDirective,
    ToolTipTemplateComponent,
    CustomTooltipComponent,
  ],
})
export class CustomTooltipModule {}
