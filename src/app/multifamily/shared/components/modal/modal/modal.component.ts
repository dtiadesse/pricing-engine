/**
 * This Modal component should be used as a base under the Design System.
 * IMPORTANT: This only encapsulates the "Status" and "Workspace" modals defined under the Design System.
 * There may be more modal types defined at a later date.
 */

import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "shared-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  @HostBinding("class.shared-modal") hostClass = true;

  @Input() title: string;
  @Input() type: "status" | "workspace" = "workspace";

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  // ------------------------------ Init ------------------------------

  constructor() {}

  ngOnInit() {}

  // ------------------------------ Handle Actions ------------------------------

  close() {
    this.closeModal.emit(true);
  }
}
