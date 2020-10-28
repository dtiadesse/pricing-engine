import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as _ from 'lodash';

// Core

import { MOCK_PIPELINE_RESULTS } from '../mocks/pipeline-management.mocks';

// Models

@Injectable({
    providedIn: 'root'
})
export class PipelineManagementService {


    constructor() {
    }

    // This will fetch and return the matching PropertySearchQueryResults results
    getPipelineResults(): Observable<any> {
        return MOCK_PIPELINE_RESULTS

        // this.http
        //     .get<PipelineResults>(
        //         `${this.appConfig.configs.pe.pipelineResults}`
        //     )
        //     .pipe(catchError(this.handleError));
    }


}
