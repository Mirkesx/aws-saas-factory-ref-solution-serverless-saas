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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ServiceHelperService } from '../../service-helper.service';
import { Artifact } from '../models/artifact.interface';
import { ArtifactsService } from '../artifacts.service';

@Component({
  selector: 'app-artifacts-detail',
  templateUrl: './artifacts-detail.component.html',
  styleUrls: [ './artifacts-detail.component.scss'  ]
})
export class ArtifactsDetailComponent implements OnInit {
  artifactId$: Observable<string>;
  artifact$: Observable<Artifact>;
  constructor(private route: ActivatedRoute,
              private artifactSvc: ArtifactsService,
              private helperSvc: ServiceHelperService) { }

  ngOnInit(): void {

    this.artifactId$ = this.route.params.pipe(
      map(a => a.artifactId)
    );

    this.artifact$ = this.artifactId$.pipe(
      switchMap(a => this.artifactSvc.get(a))
    );
  }

  today() {
    return new Date();
  }

  tenantName() {
    return this.helperSvc.getTenantName();
  }

}
