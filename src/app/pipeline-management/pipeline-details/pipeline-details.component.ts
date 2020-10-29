import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';

// Models

// Shared
import { expansionIndicatorRotate } from '../../multifamily/shared/components/animate-animation'
//'ultifamily/shared/components';

// Metadata
import {
  AwaitingApprovalData,
  DEFAULT_PIPELINE_COLUMN_METADATA,
  QUOTE_RESULTS_APPROVAL_COLUMN_METADATA,
  QUOTE_RESULTS_COLUMN_METADATA,
  QUOTE_RESULTS_EXTENSION_COLUMN_METADATA
} from './pipeline.constant';
import { PipelineManagementService } from '../../services/pipeline-management.service'
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TableOptions, TableColumn } from '../../shared/components/table/model/table.model';
import { TableComponent } from '../../shared/components/table/table/table.component';
import { MOCK_PIPELINE_RESULTS } from '../../mocks/pipeline-management.mocks';

export interface PipelineTab {
  label?: string;
  content: any[];
  index?: number;
  tableOptions?: TableOptions;
  quoteTableOptions?: TableOptions;
  quoteCount?: number;
}

@Component({
  selector: 'mf-pe-pipeline-details',
  templateUrl: './pipeline-details.component.html',
  styleUrls: ['./pipeline-details.component.scss'],
  animations: [expansionIndicatorRotate]
})
export class PipelineDetailsComponent implements OnInit {
  title = 'Welcome';
  quotes: any = {
    newQuotes: [],
    extensionQuotes: [],
    awaitingApprovalQuotes: [],
    results: null
  };

  defaultColMeta: any[] = _.clone(DEFAULT_PIPELINE_COLUMN_METADATA);
  approvalColMeta: any[] = _.clone(AwaitingApprovalData);
  quoteResultsColMeta: any[] = _.clone(QUOTE_RESULTS_COLUMN_METADATA);
  quoteResultsExtensionColMeta: any[] = _.clone(QUOTE_RESULTS_EXTENSION_COLUMN_METADATA);
  quoteResultsApprovalColMeta: any[] = _.clone(QUOTE_RESULTS_APPROVAL_COLUMN_METADATA);
  quoteResultsExtensionTableOptions: TableOptions;
  quoteResultsApprovalTableOptions: TableOptions;

  asyncTabs: Observable<PipelineTab[]>;
  lastUpdated: Date = new Date();
  defaultTableOptions: TableOptions;
  quoteResultsTableOptions: TableOptions;
  approvalTableOptions: TableOptions;
  @ViewChild('tabGroup', { static: false }) tabGroup: any;
  @ViewChild(TableComponent, { static: false }) tableComponent: TableComponent;

  // ------------------------------ Init ------------------------------

  constructor(private pipelineService: PipelineManagementService) { }

  ngOnInit() {

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

  getQuoteCount(items: any) {
    let count = 0;
    if (items.length > 0) {
      items.forEach(item => {
        count = count + item.quoteResults.length
      });

    }
    return count;
  }


  // ------------------------------ Table ------------------------------
  getQuotes(data) {
    const quoteResults = _.map(data, (item: any) => {
      item.expandedMasterDetail = _.get(item, 'quoteResults', []);
      return item;
    });
    return quoteResults;
  }

  getPipelineResults() {
    // this.pipelineService.getPipelineResults().subscribe((data: any) => {
    this.quotes = MOCK_PIPELINE_RESULTS;
    //this.quotes = data;
    const cnt = this.getQuoteCount(this.quotes.newQuotes);
    this.asyncTabs = new Observable((observer: Observer<PipelineTab[]>) => {
      observer.next([
        {
          label: 'New',
          content: this.getQuotes(this.quotes.newQuotes),
          index: 0,
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsTableOptions,
          quoteCount: this.getQuoteCount(this.quotes.newQuotes)
        },
        {
          label: 'Extension',
          content: this.getQuotes(this.quotes.extensionQuotes),
          index: 1,
          tableOptions: this.defaultTableOptions,
          quoteTableOptions: this.quoteResultsExtensionTableOptions,
          quoteCount: this.getQuoteCount(this.quotes.extensionQuotes)
        },
        {
          label: 'Awaiting Approval',
          content: this.getQuotes(this.quotes.awaitingApprovalQuotes),
          index: 2,
          tableOptions: this.approvalTableOptions,
          quoteTableOptions: this.quoteResultsApprovalTableOptions,
          quoteCount: this.getQuoteCount(this.quotes.awaitingApprovalQuotes)
        }
      ]);
      this.lastUpdated = new Date();
    });
    // });
  }

  // This will handle setting up the table options
  getTableOptions(pipelineColMetadata: any[], isQuoteOptions: boolean = false) {
    if (!_.isEmpty(pipelineColMetadata)) {
      const options: TableOptions = this._mapPipelineOptions(pipelineColMetadata, isQuoteOptions);
      return options;
    }
  }
  // ------------------------------------------------------------

  private _mapPipelineOptions(gridColMetadata: any[], isQuoteOptions) {
    const columns: TableColumn[] = isQuoteOptions
      ? this.mapQuoteResultsColumn(gridColMetadata)
      : this._mapColumns(gridColMetadata);
    const options: any = {
      columns: columns,
      elevatedTable: false,
      flexColumns: true,
      rowHeightStyle: 'highly-condensed'
    };

    return options;
  }
  // This will handle the navigation when clicking a Quote ID link in the table
  navigateTo(quoteId: number) {
    const origin: string = location.origin;
    const url = `${origin}/pe/quote/${quoteId}`;
    window.open(url, '_blank');
  }

  private mapQuoteResultsColumn(colMetadata: any[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: any) => {
      return {
        key: dc.dataMappingName,
        displayName: dc.name,
        hasCellTemplate:
          dc.dataMappingName === 'opportunityUpbAmt' ||
          dc.dataMappingName === 'statusType' ||
          dc.dataMappingName === 'quoteId' ||
          dc.dataMappingName === 'priorityIndicator' ||
          dc.dataMappingName === 'submitDateTime',
        hasEditableCells: dc.dataValueEditableInd,
        cellValueType: dc.dataValueType,

        cellTemplateClassName:
          dc.dataMappingName === 'quoteId'
            ? 'mf-w-10'
            : dc.dataMappingName === 'opportunityUpbAmt'
              ? 'mf-w-7'
              : dc.dataMappingName === 'statusType'
                ? 'mf-text-input-cell mf-w-12'
                : dc.dataMappingName === 'quoteType'
                  ? 'mf-w-15'
                  : dc.dataMappingName === 'submitDateTime'
                    ? 'mf-w-10'
                    : ''
      };
    });
    return columns;
  }

  // This will handle mapping our any to a defined TableColumn definition
  private _mapColumns(colMetadata: any[]): TableColumn[] {
    const columns: TableColumn[] = _.map(colMetadata, (dc: any) => {
      return {
        key: dc.dataMappingName,
        displayName: _.toUpper(dc.name),
        hasCellTemplate:
          dc.dataMappingName === 'quoteCount' ||
          dc.dataMappingName === 'maxUPB' ||
          dc.dataMappingName === 'opportunityId' ||
          dc.dataMappingName === 'submitDateTime',
        hasEditableCells: dc.dataValueEditableInd,
        cellValueType: dc.dataValueType,

        cellTemplateClassName:
          dc.dataMappingName === 'borrower'
            ? 'mf-text-input-cell mf-w-15'
            : dc.dataMappingName === 'propertyName'
              ? 'mf-w-15'
              : dc.dataMappingName === 'opportunityId'
                ? 'mf-w-15'
                : dc.dataMappingName === 'maxUPB'
                  ? 'mf-w-7'
                  : dc.dataMappingName === 'quoteCount'
                    ? 'mf-w-7'
                    : dc.dataMappingName === 'submitDateTime'
                      ? 'mf-w-10'
                      : ''
      };
    });
    return columns;
  }
}
