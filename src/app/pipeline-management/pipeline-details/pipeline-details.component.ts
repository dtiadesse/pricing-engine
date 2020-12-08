import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, Observer, BehaviorSubject, concat, of, timer } from "rxjs";
import { concatMapTo, switchMap } from "rxjs/operators";
import * as _ from "lodash";
// Material
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

// Shared

// Services
import { PipelineManagementService } from "../../services/pipeline-management.service";
import { pollingRequest } from "src/app/shared/utilities/polling-request";

// Components
import { StatusDialogComponent } from "../../shared/components/status-modal/status.modal.component";

import { TableComponent } from "../../shared/components/table/table/table.component";

// Models

// Metadata
import {
  AwaitingApprovalData,
  DEFAULT_PIPELINE_COLUMN_METADATA,
  QUOTE_RESULTS_APPROVAL_COLUMN_METADATA,
  QUOTE_RESULTS_COLUMN_METADATA,
  QUOTE_RESULTS_EXTENSION_COLUMN_METADATA,
  OVERVIEW_METADATA,
} from "./pipeline.constant";
import {
  PipelineResults,
  PipelineOpportunityDetails,
  QuoteStatistics,
} from "../model/pipeline-results.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import {
  TableOptions,
  TableColumn,
} from "../../shared/components/table/model/table.model";
import { expansionIndicatorRotate } from "../../multifamily/shared/components/animate-animation";
import { StatusModalMeta } from "../../shared/components/status-modal/status-model";
import { DataComponent } from "../../model/data-component";
import { TabularListItem } from "../../shared/components/tabular-list/models/tabular-list-item-model";
export interface PipelineTab {
  label?: string;
  content: any[];
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
  pipelineResults: PipelineResults = {
    newQuotes: [],
    extensionQuotes: [],
    awaitingApprovalQuotes: [],
    userId: null,
    approvalLimit: null,
  };

  defaultColMeta: DataComponent[] = _.clone(DEFAULT_PIPELINE_COLUMN_METADATA);
  approvalColMeta: DataComponent[] = _.clone(AwaitingApprovalData);
  quoteResultsColMeta: DataComponent[] = _.clone(QUOTE_RESULTS_COLUMN_METADATA);
  quoteResultsExtensionColMeta: DataComponent[] = _.clone(
    QUOTE_RESULTS_EXTENSION_COLUMN_METADATA
  );
  quoteResultsApprovalColMeta: DataComponent[] = _.clone(
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
  @ViewChild("pipelineResultsTable", { static: false })
  pipelineResultsTableRef: TableComponent;
  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;
  allRowsExpanded = false;
  expandedData: any | {};

  overviewTabularDataNew: TabularListItem[] = [];
  overviewTabularDataExtension: TabularListItem[] = [];

  overviewTabularDataApproval: TabularListItem[] = [];
  overviewMetadata: DataComponent[] = _.clone(OVERVIEW_METADATA);
  pollingForRefresh$: Observable<PipelineResults[]>;
  updPollingForRefresh$: BehaviorSubject<
    PipelineResults[] | null
  > = new BehaviorSubject<PipelineResults[] | null>(null);

  // ------------------------------ Init ------------------------------
  constructor(
    private pipelineService: PipelineManagementService,
    // private notification: SnackbarService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.expandedData = {};
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

    this.openPollingForRefresh();
  }

  // ------------------------------ Table ------------------------------
  getQuotes(data) {
    const quoteResults = _.map(data, (item: any) => {
      item.expandedMasterDetail = _.get(item, "quoteResults", []);
      return item;
    });
    return quoteResults;
  }

  onExpandAllChkboxChange(ev: MatCheckboxChange) {
    this.allRowsExpanded = ev.checked;
    this.pipelineResultsTableRef.expandedRow = null;
  }
  toggleContent(row) {
    if (this.allRowsExpanded) {
      this.allRowsExpanded = false;
    } else {
      const expandedRowOpportunityId = _.get(
        this.pipelineResultsTableRef,
        "expandedRow.opportunityId",
        null
      );
      this.pipelineResultsTableRef.expandedRow =
        expandedRowOpportunityId === row.opportunityId ? null : row;
      this.expandedData.opportunityId = expandedRowOpportunityId == row.opportunityId ? null : row.opportunityId;
    }
  }

  onShowMyQuoteChange(ev: MatCheckboxChange) {
    let filterQuotes: PipelineResults = {
      newQuotes: [],
      extensionQuotes: [],
      awaitingApprovalQuotes: [],
      approvalLimit: this.pipelineResults.approvalLimit,
      userId: this.currentUserId,
    };
    const userId = this.pipelineService.userId;
    if (ev.checked) {
      filterQuotes.newQuotes = this.pipelineResults.newQuotes.filter(
        (x: any) => x.claimedByUserId === userId
      );
      filterQuotes.extensionQuotes = this.pipelineResults.extensionQuotes.filter(
        (x: any) => x.claimedByUserId === userId
      );
      filterQuotes.awaitingApprovalQuotes = this.pipelineResults.awaitingApprovalQuotes.filter(
        (x: any) => x.claimedByUserId === userId
      );
    } else {
      filterQuotes = this.pipelineResults;
    }

    this.asyncTabs = new Observable((observer: Observer<PipelineTab[]>) => {
      observer.next([
        {
          label: "New",
          content: this.getQuotes(filterQuotes.newQuotes),
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsTableOptions,
          quoteCount: this.getQuoteCount(filterQuotes.newQuotes),
        },
        {
          label: "Extension",
          content: this.getQuotes(filterQuotes.extensionQuotes),
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsExtensionTableOptions,
          quoteCount: this.getQuoteCount(filterQuotes.extensionQuotes),
        },
        {
          label: "Awaiting Approval",
          content: this.getQuotes(filterQuotes.awaitingApprovalQuotes),
          tableOptions: this.approvalTableOptions,
          quoteTableOptions: this.quoteResultsApprovalTableOptions,
          quoteCount: this.getQuoteCount(filterQuotes.awaitingApprovalQuotes),
        },
      ]);
    });
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

  getPipelineResults() {
    this.pipelineService
      .getPipelineResults()
      .subscribe((data: PipelineResults) => {
        this.loadPipelineResults(data);
      });
      return this.pipelineService
      .getPipelineResults();
    }


  loadPipelineResults(data: PipelineResults) {
    this.pipelineResults = data;
    this.asyncTabs = new Observable((observer: Observer<PipelineTab[]>) => {
      observer.next([
        {
          label: "New",
          content: this.getQuotes(this.pipelineResults.newQuotes),
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsTableOptions,
          quoteCount: this.getQuoteCount(this.pipelineResults.newQuotes),
        },
        {
          label: "Extension",
          content: this.getQuotes(this.pipelineResults.extensionQuotes),
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsExtensionTableOptions,
          quoteCount: this.getQuoteCount(
            this.pipelineResults.extensionQuotes
          ),
        },
        {
          label: "Awaiting Approval",
          content: this.getQuotes(
            this.pipelineResults.awaitingApprovalQuotes
          ),
          tableOptions: this.approvalTableOptions,
          quoteTableOptions: this.quoteResultsApprovalTableOptions,
          quoteCount: this.getQuoteCount(
            this.pipelineResults.awaitingApprovalQuotes
          ),
        },
      ]);
      this.lastUpdated = new Date();
    });
    this.overviewTabularDataNew = this.setUpLists(
      this.pipelineResults.pipelineStatistics.newQuotes
    );
    this.overviewTabularDataExtension = this.setUpLists(
      this.pipelineResults.pipelineStatistics.extensionQuotes
    );
    this.overviewTabularDataApproval = this.setUpLists(
      this.pipelineResults.pipelineStatistics.awaitingApprovalQuotes
    );
  }

  //------------- Get pipeline Results--------------

  // This will set up our subscription to the getPipelineResults API to poll for updated data
   private openPollingForRefresh() {
    const pollingInterval = 3000;
    const pollingStream$ = pollingRequest(
      this.pipelineService.getPipelineResults(),
      pollingInterval
    );
    timer(1, pollingInterval).pipe(
      concatMapTo(pollingStream$)
    ).subscribe((data: PipelineResults) => {
        this.loadPipelineResults(data);
      });
   }

  // ApprovalHold
  onApprovalHoldClick(row) {
    this.pipelineService
      .getOpportunityDetails(row.opportunityId)
      .subscribe((opportunityDetails: PipelineOpportunityDetails) => {
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
        console.log("success", res.message, 4000);
        if (res) {
          this.getPipelineResults();
        }
      },
      (error) => console.log("error", error, 4000)
    );
  }

  // Claim the opportunity
  onClaim(row) {
    this.pipelineService
      .getOpportunityDetails(row.opportunityId)
      .subscribe((opportunityDetails: PipelineOpportunityDetails) => {
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
        console.log("success", res.message, 4000);
        if (res) {
          this.getPipelineResults();
        }
      },
      (error) => console.log("error", error, 4000)
    );
  }

  // This will handle setting up the table options
  getTableOptions(
    pipelineColMetadata: DataComponent[],
    isQuoteOptions: boolean = false
  ) {
    if (!_.isEmpty(pipelineColMetadata)) {
      const options: TableOptions = this._mapPipelineOptions(
        pipelineColMetadata,
        isQuoteOptions
      );
      return options;
    }
  }
  // ------------------------------------------------------------

  private _mapPipelineOptions(
    gridColMetadata: DataComponent[],
    isQuoteOptions
  ) {
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

  private mapQuoteResultsColumn(colMetadata: DataComponent[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: DataComponent) => {
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
            ? "mf-w-10"
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
  private _mapColumns(colMetadata: DataComponent[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: DataComponent) => {
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

  // This will handle setting up the data to be passed to the instances of the TabularListComponent
  setUpLists(keyData: QuoteStatistics): TabularListItem[] {
    const overviewMetadata: DataComponent[] = _.clone(this.overviewMetadata);
    const updMeta: DataComponent[] = _.map(
      overviewMetadata,
      (item: DataComponent) => {
        item.value = keyData[item.dataMappingName];
        return item;
      }
    );

    const listData: TabularListItem[] = _.map(
      updMeta,
      (item: DataComponent) => {
        return {
          key: item.dataMappingName,
          label: item.name,
          value: item.value,
          type: item.dataValueType,
        };
      }
    );

    return listData;
  }
}
