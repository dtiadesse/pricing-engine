/**
 * This Button component should be used as a base under the Design System.
 * IMPORTANT: This only encapsulates the "Primary", "Secondary", and "Tertiary" buttons defined under the Design System.
 *            The "Toggle Button" needs to be revisited. More to come soon.
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";

// Material
import { MatButtonToggleChange } from "@angular/material/button-toggle";

// Models
import { ButtonType, ToggleButtonGroup } from "../models/button.model";

@Component({
  selector: "shared-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
  @HostBinding("class.shared-button") hostClass = true;

  @Input() id: string;

  @Input() type: ButtonType = "primary";

  @Input() text: string;

  public fullBtnClassName = "";
  private _customTextClass = "";
  @Input()
  set customTextClass(className: string) {
    this._customTextClass = className;
    this._setBtnClassName();
  }
  get customTextClass(): string {
    return this._customTextClass;
  }

  @Input() icon: string;

  @Input() iconAlignment: "left" | "right" = "right";

  @Input() disabled = false;

  @Output() btnClick = new EventEmitter();

  @Input() toggleButtonGroup: ToggleButtonGroup;

  @Output() toggleButtonChange: EventEmitter<any> = new EventEmitter();

  // ------------------------------ Init ------------------------------

  constructor() {}

  ngOnInit() {
    this._setBtnClassName();
  }

  // ------------------------------ Button Properties ------------------------------

  // This will handle updating the class name dynamically when the customTextClass Input changes
  private _setBtnClassName() {
    let cls = "";

    switch (this.type) {
      case "primary":
      case "secondary":
      case "tertiary":
        if (this.icon && this.iconAlignment) {
          cls += `mf-button-icon-${this.iconAlignment} ${this._customTextClass}`;
        }
        break;
      default:
        cls += this._customTextClass;
        break;
    }

    this.fullBtnClassName = cls === "" ? this._customTextClass : cls;
  }

  // This will handle any click events for the button
  buttonClick($event) {
    const btnClickEvent = { id: this.id, event: $event };
    this.btnClick.emit(btnClickEvent);
  }

  // ------------------------------ Handle Toggle ------------------------------

  // This exposes the MatButtonToggleChange event for the user
  onToggleButtonChange($event: MatButtonToggleChange) {
    this.toggleButtonChange.emit($event);
  }
}
