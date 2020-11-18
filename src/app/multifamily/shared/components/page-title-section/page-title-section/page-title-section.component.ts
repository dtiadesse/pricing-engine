import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "shared-page-title-section",
  templateUrl: "./page-title-section.component.html",
  styleUrls: ["./page-title-section.component.scss"],
})
export class PageTitleSectionComponent {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbLabel: string;

  @Input()
  public breadcrumbLink: string;

  constructor(private _location: Location, private _router: Router) {}

  public onBreadcrumbClick(): void {
    if (this.breadcrumbLink) {
      this._router.navigate([this.breadcrumbLink]);
    } else {
      this._location.back();
    }
  }
}
