/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceHelperService } from '../service-helper.service';
import { Artifact } from './models/artifact.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtifactsService {
  artifacts: Artifact[] = [];
  constructor(private http: HttpClient,
              private svcHelper: ServiceHelperService) { }

  fetch(): Observable<Artifact[]> {
    const url = `${this.svcHelper.getUrl('artifacts')}`;
    return this.http.get<Artifact[]>(url);
  }

  get(artifactId: string): Observable<Artifact> {
    const url = `${this.svcHelper.getUrl('artifact')}/${artifactId}`;
    return this.http.get<Artifact>(url);
  }

  create(artifact: Artifact): Observable<Artifact> {
    const url = `${this.svcHelper.getUrl('artifact')}`;
    return this.http.post<Artifact>(url, artifact);
  }

}
