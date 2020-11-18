import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, Observer } from "rxjs";
import * as _ from "lodash";

// Material
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

// Shared
// import {
//   expansionIndicatorRotate,
//   SnackbarService,
// } from "@Multifamily/shared/components";

// Services
import { PipelineManagementService } from "../../services/pipeline-management.service";

// Components
import { StatusDialogComponent } from "../../shared/components/status-modal/status.modal.component";
// "../../../../shared/components/status-modal/status-modal.component";
import { TableComponent } from "../../shared/components/table/table/table.component";

// Models

// Metadata
import {
  AwaitingApprovalData,
  DEFAULT_PIPELINE_COLUMN_METADATA,
  QUOTE_RESULTS_APPROVAL_COLUMN_METADATA,
  QUOTE_RESULTS_COLUMN_METADATA,
  QUOTE_RESULTS_EXTENSION_COLUMN_METADATA,
} from "./pipeline.constant";
import {
  TableOptions,
  TableColumn,
} from "../../shared/components/table/model/table.model";
import { expansionIndicatorRotate } from "../../multifamily/shared/components/animate-animation";
import { StatusModalMeta } from "../../shared/components/status-modal/status-model";

export interface PipelineTab {
  label?: string;
  content: any[];
  index?: number;
  tableOptions?: TableOptions;
  quoteTableOptions?: TableOptions;
  quoteCount?: number;
}

@Component({
  selector: "mf-pe-pipeline-details",
  templateUrl: "./pipeline-details.component.html",
  styleUrls: ["./pipeline-details.component.scss"],
  animations: [expansionIndicatorRotate],
})
export class PipelineDetailsComponent implements OnInit {
  quotes: any = {
    newQuotes: [],
    extensionQuotes: [],
    awaitingApprovalQuotes: [],
    results: null,
    userId: null,
    approvalLimit: null,
  };

  defaultColMeta: any[] = _.clone(DEFAULT_PIPELINE_COLUMN_METADATA);
  approvalColMeta: any[] = _.clone(AwaitingApprovalData);
  quoteResultsColMeta: any[] = _.clone(QUOTE_RESULTS_COLUMN_METADATA);
  quoteResultsExtensionColMeta: any[] = _.clone(
    QUOTE_RESULTS_EXTENSION_COLUMN_METADATA
  );
  quoteResultsApprovalColMeta: any[] = _.clone(
    QUOTE_RESULTS_APPROVAL_COLUMN_METADATA
  );
  quoteResultsExtensionTableOptions: TableOptions;
  quoteResultsApprovalTableOptions: TableOptions;
  currentUserId: string;
  asyncTabs: Observable<PipelineTab[]>;
  lastUpdated: Date = new Date();
  defaultTableOptions: TableOptions;
  quoteResultsTableOptions: TableOptions;
  approvalTableOptions: TableOptions;
  @ViewChild("tabGroup", { static: false }) tabGroup: any;
  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;
  errorMessage: string;
  // ------------------------------ Init ------------------------------

  constructor(
    private pipelineService: PipelineManagementService,
    private notification: any,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.pipelineService.userId) {
      this.currentUserId = `${this.pipelineService.userId}`;
    }

    this.defaultTableOptions = Object.assign(
      {},
      _.cloneDeep(this.getTableOptions(this.defaultColMeta)),
      { hasMasterDetailRows: true }
    );

    this.approvalTableOptions = Object.assign(
      {},
      _.cloneDeep(this.getTableOptions(this.approvalColMeta)),
      { hasMasterDetailRows: true }
    );
    this.quoteResultsTableOptions = _.cloneDeep(
      this.getTableOptions(this.quoteResultsColMeta, true)
    );

    this.quoteResultsExtensionTableOptions = _.cloneDeep(
      this.getTableOptions(this.quoteResultsExtensionColMeta, true)
    );
    this.quoteResultsApprovalTableOptions = _.cloneDeep(
      this.getTableOptions(this.quoteResultsApprovalColMeta, true)
    );

    this.getPipelineResults();
  }

  // ------------------------------ Table ------------------------------
  getQuotes(data) {
    const quoteResults = _.map(data, (item: any) => {
      item.expandedMasterDetail = _.get(item, "quoteResults", []);
      return item;
    });
    return quoteResults;
  }

  //--------------- To get the quote count of the each Opportunity -------------------
  getQuoteCount(items: any) {
    let count = 0;
    if (items.length > 0) {
      items.forEach((item) => {
        count = count + item.quoteResults.length;
      });
    }
    return count;
  }

  //------------- Get pipeline Results--------------
  getPipelineResults() {
    this.pipelineService.getPipelineResults().subscribe((data: any) => {
      this.quotes = data;
      this.asyncTabs = new Observable((observer: Observer<PipelineTab[]>) => {
        observer.next([
          {
            label: "New",
            content: this.getQuotes(this.quotes.newQuotes),
            index: 0,
            tableOptions: this.defaultTableOptions,
            quoteTableOptions: this.quoteResultsTableOptions,
            quoteCount: this.getQuoteCount(this.quotes.newQuotes),
          },
          {
            label: "Extension",
            content: this.getQuotes(this.quotes.extensionQuotes),
            index: 1,
            tableOptions: this.defaultTableOptions,
            quoteTableOptions: this.quoteResultsExtensionTableOptions,
            quoteCount: this.getQuoteCount(this.quotes.extensionQuotes),
          },
          {
            label: "Awaiting Approval",
            content: this.getQuotes(this.quotes.awaitingApprovalQuotes),
            index: 2,
            tableOptions: this.approvalTableOptions,
            quoteTableOptions: this.quoteResultsApprovalTableOptions,
            quoteCount: this.getQuoteCount(this.quotes.awaitingApprovalQuotes),
          },
        ]);
        this.lastUpdated = new Date();
      });
    });
  }

  // ApprovalHold
  onApprovalHoldClick(row) {
    this.pipelineService
      .getOpportunityDetails(row.opportunityId)
      .subscribe((opportunityDetails: any) => {
        if (opportunityDetails.approvalHold) {
          const dialogConfiguration: StatusModalMeta = {
            iconClass: "mf warning",
            iconName: "warning",
            primaryText: "Yes",
            btnId: "pipelineClaim",
            secondaryText: "No",
            messages: [
              "This Opportunity has already been placed on hold by another approver. Would you like to claim it?",
            ],
          };
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = false;
          dialogConfig.minWidth = 480;
          dialogConfig.width = "480px";
          dialogConfig.data = dialogConfiguration;
          const warningDialogRef = this.dialog.open(
            StatusDialogComponent,
            dialogConfig
          );
          warningDialogRef.afterClosed().subscribe((result) => {
            if (!!result) {
              this.postApprovalHoldRequest(row.opportunityId, "hold");
            } else {
              this.getPipelineResults();
            }
          });
        } else if (opportunityDetails.approvalHoldId === this.currentUserId) {
          this.postApprovalHoldRequest(row.opportunityId, "release");
        } else {
          this.postApprovalHoldRequest(row.opportunityId, "hold");
        }
      });
  }

  postApprovalHoldRequest(opportunityId: number, approvalType: string) {
    this.pipelineService.approvalHold(opportunityId, approvalType).subscribe(
      (res: any) => {
        this.notification.openSnackBar("success", res.message, 4000);
        if (res) {
          this.getPipelineResults();
        }
      },
      (error) => this.notification.openSnackBar("error", error, 4000)
    );
  }

  // Claim the opportunity
  onClaim(row) {
    this.pipelineService
      .getOpportunityDetails(row.opportunityId)
      .subscribe((opportunityDetails: any) => {
        if (opportunityDetails.claimedByUser) {
          const dialogConfiguration: StatusModalMeta = {
            iconClass: "mf warning",
            iconName: "warning",
            primaryText: "Yes",
            btnId: "pipelineClaim",
            secondaryText: "No",
            messages: [
              "This Opportunity has already been claimed. Would you like to claim it?",
            ],
          };
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = false;
          dialogConfig.minWidth = 480;
          dialogConfig.width = "480px";
          dialogConfig.data = dialogConfiguration;
          const warningDialogRef = this.dialog.open(
            StatusDialogComponent,
            dialogConfig
          );
          warningDialogRef.afterClosed().subscribe((result) => {
            if (!!result) {
              this.claimQuotes(row.opportunityId, "claim");
            } else {
              // Refreshing Data
              this.getPipelineResults();
            }
          });
        } else if (opportunityDetails.claimedByUserId === this.currentUserId) {
          this.claimQuotes(row.opportunityId, "unclaim");
        } else {
          this.claimQuotes(row.opportunityId, "claim");
        }
      });
  }

  claimQuotes(opportunityId: number, claimType: string) {
    this.pipelineService.claim(opportunityId, claimType).subscribe(
      (res: any) => {
        this.notification.openSnackBar("success", res.message, 4000);
        if (res) {
          this.getPipelineResults();
        }
      },
      (error) => this.notification.openSnackBar("error", error, 4000)
    );
  }

  // This will handle setting up the table options
  getTableOptions(pipelineColMetadata: any[], isQuoteOptions: boolean = false) {
    if (!_.isEmpty(pipelineColMetadata)) {
      const options: TableOptions = this._mapPipelineOptions(
        pipelineColMetadata,
        isQuoteOptions
      );
      return options;
    }
  }
  // ------------------------------------------------------------

  private _mapPipelineOptions(gridColMetadata: any[], isQuoteOptions) {
    const columns: TableColumn[] = isQuoteOptions
      ? this.mapQuoteResultsColumn(gridColMetadata)
      : this._mapColumns(gridColMetadata);
    const options: TableOptions = {
      columns: columns,
      elevatedTable: false,
      flexColumns: true,
      rowHeightStyle: "highly-condensed",
    };

    return options;
  }
  // This will handle the navigation when clicking a Quote ID link in the table
  navigateTo(quoteId: number) {
    const origin: string = location.origin;
    const url = `${origin}/pe/quote/${quoteId}`;
    window.open(url, "_blank");
  }

  private mapQuoteResultsColumn(colMetadata: any[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: any) => {
      return {
        key: dc.dataMappingName,
        displayName: dc.name,
        hasCellTemplate:
          dc.dataMappingName === "opportunityUpbAmt" ||
          dc.dataMappingName === "statusType" ||
          dc.dataMappingName === "quoteId" ||
          dc.dataMappingName === "priorityIndicator" ||
          dc.dataMappingName === "submitDateTime",
        hasEditableCells: dc.dataValueEditableInd,
        cellValueType: dc.dataValueType,
        cellTemplateClassName:
          dc.dataMappingName === "quoteId"
            ? "mf-w-15"
            : dc.dataMappingName === "opportunityUpbAmt"
            ? "mf-w-7"
            : dc.dataMappingName === "statusType"
            ? "mf-text-input-cell mf-w-12"
            : dc.dataMappingName === "quoteType"
            ? "mf-w-15"
            : dc.dataMappingName === "submitDateTime"
            ? "mf-w-10"
            : "",
      };
    });
    return columns;
  }

  // This will handle mapping our DataComponent to a defined TableColumn definition
  private _mapColumns(colMetadata: any[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: any) => {
      return {
        key: dc.dataMappingName,
        displayName: _.toUpper(dc.name),
        hasCellTemplate:
          dc.dataMappingName === "quoteCount" ||
          dc.dataMappingName === "maxUPB" ||
          dc.dataMappingName === "opportunityId" ||
          dc.dataMappingName === "submitDateTime",
        hasEditableCells: dc.dataValueEditableInd,
        cellValueType: dc.dataValueType,

        cellTemplateClassName:
          dc.dataMappingName === "borrower"
            ? "mf-text-input-cell mf-w-15"
            : dc.dataMappingName === "propertyName"
            ? "mf-w-15"
            : dc.dataMappingName === "opportunityId"
            ? "mf-w-15"
            : dc.dataMappingName === "maxUPB"
            ? "mf-w-7"
            : dc.dataMappingName === "quoteCount"
            ? "mf-w-7"
            : dc.dataMappingName === "submitDateTime"
            ? "mf-w-10"
            : "",
      };
    });
    return columns;
  }
}
