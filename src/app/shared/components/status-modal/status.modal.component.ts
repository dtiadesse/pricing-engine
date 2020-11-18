import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StatusModalMeta } from "./status-model";

@Component({
  selector: "mf-pe-status-modal",
  templateUrl: "./status-modal.component.html",
  styleUrls: ["./status-modal.component.scss"],
})
export class StatusDialogComponent implements OnInit {
  dialogConfiguration: StatusModalMeta;

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusModalMeta
  ) {}

  public ngOnInit() {
    this.dialogConfiguration = this.data;
    this.dialogConfiguration.iconName = this.data.iconName
      ? this.data.iconName
      : "warning";
    this.dialogConfiguration.iconClass = this.data.iconClass
      ? this.data.iconClass
      : "";
    this.dialogConfiguration.secondaryText = this.data.secondaryText
      ? this.data.secondaryText
      : "No";
    this.dialogConfiguration.primaryText = this.data.primaryText
      ? this.data.primaryText
      : "Yes";
  }

  close() {
    this.dialogRef.close();
  }
}
