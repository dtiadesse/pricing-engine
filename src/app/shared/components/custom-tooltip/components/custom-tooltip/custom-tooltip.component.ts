import { Component, Input, TemplateRef } from "@angular/core";

@Component({
  selector: "mf-pe-custom-tooltip",
  templateUrl: "./custom-tooltip.component.html",
  styleUrls: ["./custom-tooltip.component.scss"],
})
export class CustomTooltipComponent {
  @Input() text;
  @Input() contentTemplate: TemplateRef<any>;
  @Input() iconName = "info";
}
