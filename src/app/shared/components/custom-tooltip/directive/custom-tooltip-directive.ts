import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  OnInit,
  HostListener,
  ComponentRef,
  OnDestroy,
} from "@angular/core";
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ToolTipTemplateComponent } from "../components/tooltip-template/tooltip-template.component";

@Directive({
  /* tslint:disable */
  selector: "[mfPeCustomToolTip]",
  /* tslint:enable */
})
export class CustomTooltipDirective implements OnInit, OnDestroy {
  @Input() showToolTip = true;
  @Input(`mfPeCustomToolTip`) text;

  @Input() contentTemplate: TemplateRef<any>;

  private _overlayRef: OverlayRef;

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (!this.showToolTip) {
      return;
    }

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([
        {
          originX: "center",
          originY: "bottom",
          overlayX: "center",
          overlayY: "top",
          offsetY: 5,
        },
      ]);

    this._overlayRef = this._overlay.create({ positionStrategy });
  }

  @HostListener("mouseenter")
  show() {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<ToolTipTemplateComponent> = this._overlayRef.attach(
        new ComponentPortal(ToolTipTemplateComponent)
      );
      tooltipRef.instance.text = this.text;
      tooltipRef.instance.contentTemplate = this.contentTemplate;
    }
  }

  @HostListener("mouseleave")
  hide() {
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
  }

  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
