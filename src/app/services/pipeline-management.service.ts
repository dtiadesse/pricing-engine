import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import * as _ from "lodash";
import { of } from "rxjs";
import { MOCK_PIPELINE_RESULTS } from "../mocks/pipeline-management.mocks";

@Injectable({
  providedIn: "root",
})
export class PipelineManagementService {
  maxQuotesPerFetch = 1000;

  private _userId = "";
  set userId(id: string) {
    this._userId = id;
  }
  get userId(): string {
    return this._userId;
  }

  // ------------------------------ Init ------------------------------

  constructor() {}

  // ------------------------------ Top-Level ------------------------------

  // This will fetch and return the matching PropertySearchQueryResults results
  getPipelineResults(): Observable<any> {
    return of(MOCK_PIPELINE_RESULTS);
  }

  // Claim the Opportunity
  claim(opportunityId: number, claimType: string): Observable<any> {
    return of(MOCK_PIPELINE_RESULTS);
  }

  // Get opportunity detalis
  getOpportunityDetails(opportunityId: number): Observable<any> {
    return of(MOCK_PIPELINE_RESULTS);
  }

  // Approval hold of an Opportunity
  approvalHold(oppId: number, approvalType: string): Observable<any> {
    return of(MOCK_PIPELINE_RESULTS);
  }

  // This will handle any errors that may occur
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
