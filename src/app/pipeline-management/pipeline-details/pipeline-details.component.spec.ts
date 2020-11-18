import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, throwError } from "rxjs";

// Material
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";

// Models
import { SuccessResponse } from "../../../../models";

// Shared
import { PipesModule } from "../../../../shared/pipes/pipes.module";
import { SnackbarService, SnackbarType } from "@Multifamily/shared/components";

// Components
import { PipelineDetailsComponent } from "./pipeline-details.component";

// Services
import { PipelineManagementService } from "../../services/pipeline-management.service";

// Mocks
import { mockPipelineResults } from "../../../../mocks/pipeline-management.mock";
import { MatSnackbar } from "../../../../mocks";

describe("PipelineDetailsComponent", () => {
  let component: PipelineDetailsComponent;
  let fixture: ComponentFixture<PipelineDetailsComponent>;
  let service: PipelineManagementService;
  let snackbarService: SnackbarService;
  let mocks: { [key: string]: any };
  let mockWindow: Partial<Window>;

  beforeEach(async(() => {
    mocks = mockPipelineResults();

    const pipelineServiceStub: Partial<PipelineManagementService> = {
      getPipelineResults: jest.fn(() => of(mocks.pipelineResults)),
      getOpportunityDetails: jest.fn(() => of(mocks.pipelineResults)),
      claim: jest.fn(() => of(mocks.success)),
      approvalHold: jest.fn(() => of(mocks.success)),
    };
    class MatDialogStub {
      result = true;
      setResult(val: boolean) {
        this.result = val;
      }

      open() {
        return { afterClosed: () => of(this.result) };
      }
    }
    const matDialogStub = new MatDialogStub();

    const snackbarServiceStub: any = {
      openSnackBar: jest.fn(
        (type: SnackbarType, message: string, duration: number = 2000) =>
          new MatSnackbar()
      ),
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PipesModule, MatMenuModule],
      declarations: [PipelineDetailsComponent],
      providers: [
        { provide: PipelineManagementService, useValue: pipelineServiceStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: SnackbarService, useValue: snackbarServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mocks = mockPipelineResults();
    fixture = TestBed.createComponent(PipelineDetailsComponent);
    component = fixture.componentInstance;
    mocks = mockPipelineResults();
    service = TestBed.get(PipelineManagementService);
    snackbarService = TestBed.get(SnackbarService);
    mockWindow = { open: jest.fn() };
    fixture.detectChanges();
  });

  /**
   * This should be boilerplate.
   * This is necessary whenever you have multiple mocks of the same function/object that could be used and
   * manipulated throughout the test suite.
   */
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // ------------------------------ Methods ------------------------------

  it("should load the pipeline details", () => {
    component.getPipelineResults();
    expect(component.quotes.newQuotes.length).toBe(4);
  });

  it("should reload the pipeline results", () => {
    const actual = new Date();
    component.getPipelineResults();
    expect(component.lastUpdated).not.toBe(actual);
  });

  it("should call window.open", () => {
    const windowSpy = jest
      .spyOn(window, "open")
      .mockImplementation(mockWindow.open);
    component.navigateTo(mocks.quoteId);
    expect(windowSpy).toHaveBeenCalled();
  });

  it("should count the all quotes for the all opportunities", () => {
    mocks = mockPipelineResults();
    const count = component.getQuoteCount(component.quotes.newQuotes);
    expect(count).toBe(7);
  });

  it("should claim quotes", () => {
    const snackbarSpy = jest.spyOn(snackbarService, "openSnackBar");
    const pipelineServiceClaimSpy = jest.spyOn(service, "claim");

    const mockSuccessResponse: SuccessResponse = {
      message: "Successfully claimed all quotes.",
    };
    pipelineServiceClaimSpy.mockReturnValueOnce(of(mockSuccessResponse));

    const mockOpportunity = mocks.pipelineResults.newQuotes[0];
    component.onClaim(mockOpportunity);
    fixture.detectChanges();

    expect(service.claim).toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith(
      "success",
      mockSuccessResponse.message,
      4000
    );
  });

  it("should show an error snackbar if there is an error while placing a claim on an opportunity", () => {
    const snackbarSpy = jest.spyOn(snackbarService, "openSnackBar");
    const pipelineClaimSpy = jest.spyOn(service, "claim");

    const mockError: ErrorEvent = new ErrorEvent("Network error", {
      message: "simulated network error",
    });
    pipelineClaimSpy.mockReturnValueOnce(throwError(mockError));

    const mockOpportunity = mocks.pipelineResults.newQuotes[1];
    component.claimQuotes(mockOpportunity.opportunityID, "claim");
    fixture.detectChanges();

    expect(snackbarSpy).toHaveBeenCalled();
  });

  it("should attempt to place an approval hold ", () => {
    const snackbarSpy = jest.spyOn(snackbarService, "openSnackBar");
    const pipelineServiceHoldSpy = jest.spyOn(service, "approvalHold");

    const mockSuccessResponse: SuccessResponse = {
      message: "Successfully placed an approval hold.",
    };
    pipelineServiceHoldSpy.mockReturnValueOnce(of(mockSuccessResponse));

    const mockOpportunity = mocks.pipelineResults.newQuotes[1];
    component.postApprovalHoldRequest(mockOpportunity.opportunityID, "hold");
    fixture.detectChanges();

    expect(service.approvalHold).toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith(
      "success",
      mockSuccessResponse.message,
      4000
    );
  });

  it("should place an approval hold for an existing oppourtunity", () => {
    component.currentUserId = "f20125";
    const mockOpportunity = mocks.pipelineResults.awaitingApprovalQuotes[0];
    component.onApprovalHoldClick(mockOpportunity);
    fixture.detectChanges();
    expect(service.approvalHold).toHaveBeenCalled();
  });

  it("should show an error snackbar if there is an error while placing an approval hold request", () => {
    const snackbarSpy = jest.spyOn(snackbarService, "openSnackBar");
    const mockError: ErrorEvent = new ErrorEvent("Network error", {
      message: "simulated network error",
    });
    const pipelinePostApprovalHoldRequestSpy = jest.spyOn(
      service,
      "approvalHold"
    );
    pipelinePostApprovalHoldRequestSpy.mockReturnValueOnce(
      throwError(mockError)
    );

    const mockOpportunity = mocks.pipelineResults.newQuotes[1];
    component.postApprovalHoldRequest(mockOpportunity.opportunityID, "hold");
    fixture.detectChanges();

    expect(snackbarSpy).toHaveBeenCalled();
  });
});
