import { Component, Input, TemplateRef } from "@angular/core";

@Component({
  template: `
    <div class="tooltip-conatiner">
      <ng-template #simpleText> {{ text }} </ng-template>
      <ng-container *ngTemplateOutlet="contentTemplate || simpleText">
      </ng-container>
    </div>
  `,
  styleUrls: ["./tooltip-template.component.scss"],
})
export class ToolTipTemplateComponent {
  @Input() text: string;
  @Input() contentTemplate: TemplateRef<any>;
}
