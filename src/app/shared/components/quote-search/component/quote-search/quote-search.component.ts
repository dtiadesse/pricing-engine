import { Component, OnInit, Input } from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from "rxjs/operators";
import {
  QuoteSearchQueryResults,
  Opportunity,
  SearchType,
} from "../../models/quote-search.model";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { QuoteSearchService } from "../../quote-search.service";

@Component({
  selector: "mf-pe-quote-search",
  templateUrl: "./quote-search.component.html",
  styleUrls: ["./quote-search.component.scss"],
})
export class QuoteSearchComponent implements OnInit {
  opportunities: Opportunity[]; //Should this class be "PEOpportunity" or some other descriptive term?
  @Input() searchControl: FormControl = new FormControl();

  /**
   * Used to build the appropriate SearchResultComponents.
   */
  searchType: SearchType;

  @Input() openInNewWindow = true;
  @Input() minimumIdCharacters = 3;
  @Input() minimumTextCharacters = 5;
  @Input() label =
    'Prefix with "Q" for Quote ID, "O" for Opportunity ID, "L" for Loan ID, or enter a Property Name';
  @Input() placeholder = "Ex. Q945, O100, L211, Creek Apartments";

  typeAheadVisible: boolean;

  //Regex variables for allowing minimumCharacters to affect the regex testing.
  validQOLQueryRegex: RegExp;
  validQuoteQueryRegex: RegExp;
  validOpportunityQueryRegex: RegExp;
  validLoanQueryRegex: RegExp;

  constructor(
    private quoteSearchService: QuoteSearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Had these in the constructor. I moved them here incase the Input for minimumCharacters ever had reason to be used.
    // /(o|O|q|Q|l|L)\d{3}/
    this.validQOLQueryRegex = new RegExp(
      `(o|O|q|Q|l|L)\\d{${this.minimumIdCharacters}}`
    );
    this.validQuoteQueryRegex = new RegExp(
      `(q|Q)\\d{${this.minimumIdCharacters}}`
    );
    this.validOpportunityQueryRegex = new RegExp(
      `(o|O)\\d{${this.minimumIdCharacters}}`
    );
    this.validLoanQueryRegex = new RegExp(
      `(l|L)\\d{${this.minimumIdCharacters}}`
    );

    this.subscribeToSearch();
  }

  subscribeToSearch() {
    this.opportunities = null;
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((queryOld: string, queryNew: string) => {
          if (
            !this.validQuoteQueryRegex.test(queryOld) ||
            queryNew.length < this.minimumTextCharacters
          ) {
            this.typeAheadVisible = false;
          }
          return queryNew === queryOld;
        }),
        filter((query: string) => {
          return !this.shouldBeFiltered(query);
        }),
        switchMap((query: string) => {
          this.typeAheadVisible = true;
          return this.quoteSearchService.getQueryResults(query.toUpperCase());
        })
      )
      .subscribe(
        (results: QuoteSearchQueryResults) => {
          this.acceptResults(results);
        },
        (error) => {
          //Future Enhancements: Provide feedback to the user based on the type of error.
          //e.g. "Internal Error" vs "No quotes found with that ID"
          this.subscribeToSearch();
        }
      );
  }

  shouldBeFiltered(query: string): boolean {
    if (this.validQuoteQueryRegex.test(query)) {
      this.searchType = "quote";
    } else if (this.validOpportunityQueryRegex.test(query)) {
      this.searchType = "opportunity";
    } else if (this.validLoanQueryRegex.test(query)) {
      this.searchType = "loan";
    } else if (query.length >= 5) {
      this.searchType = "property";
    } else {
      return true;
    }
    return false;
  }

  acceptResults(results: QuoteSearchQueryResults) {
    this.opportunities = results.searchResults;
  }

  navigate(quoteId: string) {
    const urlPartial = `/pe/quote/${quoteId}`;
    const url = window.location.origin + urlPartial;

    if (this.openInNewWindow) {
      window.open(url);
    } else {
      this.router.navigate([urlPartial]);
    }
  }
}
