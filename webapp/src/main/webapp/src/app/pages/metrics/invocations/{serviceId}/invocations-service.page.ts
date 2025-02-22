/*
 * Licensed to Laurent Broudoux (the "Author") under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. Author licenses this
 * file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DailyInvocations } from 'src/app/models/metric.model';

import { MetricsService } from '../../../../services/metrics.service';

@Component({
  selector: 'invocations-service-page',
  templateUrl: './invocations-service.page.html',
  styleUrls: ['./invocations-service.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvocationsServicePageComponent implements OnInit {

  serviceName: string;
  serviceVersion: string;
  dailyInvocations: Observable<DailyInvocations>

  day: Date = null;
  hour: number = 0;
  serviceNameAndVersion: string;
  
  constructor(private metricsSvc: MetricsService, 
    private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.dailyInvocations = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.serviceName = params.get('serviceName');
        this.serviceVersion = params.get('serviceVersion');
        this.serviceNameAndVersion = this.serviceName + ':' + this.serviceVersion;
        return this.metricsSvc.getServiceInvocationStats(params.get('serviceName'), params.get('serviceVersion'), new Date())
      })
    );
  }

  updateServiceInvocationStats(): void {
    if (this.day != null) {
      this.dailyInvocations = this.metricsSvc.getServiceInvocationStats(this.serviceName, this.serviceVersion, this.day);
    }
  }

  changeDay(value: Date): void {
    this.day = value;
  }
  changeHour(value: number): void {
    this.hour = value;
  }
}