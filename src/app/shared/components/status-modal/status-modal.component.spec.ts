import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import * as _ from "lodash";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { StatusDialogComponent } from "./status-modal.component";

describe("StatusDialogComponent", () => {
  let component: StatusDialogComponent;
  let fixture: ComponentFixture<StatusDialogComponent>;
  let mocks: { [key: string]: any };

  beforeEach(async(() => {
    mocks = {};
    const dialogMock = {
      close: () => {},
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mocks },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
      ],
      declarations: [StatusDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call the function to close the dialog", () => {
    component.close();
    const spy2 = jest.spyOn(component.dialogRef, "close");
    expect(spy2).toHaveBeenCalled();
  });
});
