import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { SpaceServiceService } from "src/space-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  launches: any;
  launchedYear = [];
  uniqueLaunchYear = [];
  index = 0;
  launchesCount = 0;
  launchStatus: string = "";
  landstatus: string = "";
  year: string = "";

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _router: Router,
    private sapceXData: SpaceServiceService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.getMethod();
    }
  }
  ngOnInit() {  }

  getMethod() {
    this.sapceXData.getAllLaunches().subscribe((data) => {
      this.launches = data;
      this.launchesCount = data.length;

      for (let i = 0; i < this.launches.length; i++) {
        this.launchedYear[i] = this.launches[i].launch_year;
      }
      this.launchedYear.sort((a, b) => {
        return a - b;
      });

      for (let i = 0, j = 1; i < this.launchedYear.length; i++, j++) {
        if (this.launchedYear[i] != this.launchedYear[j]) {
          this.uniqueLaunchYear[this.index] = this.launchedYear[i];
          this.index++;
        }
      }
    });
  }

  filterLaunch(event) {
    this.launchStatus = event.target.textContent.toLowerCase();
    this._router.navigate([""], {
      queryParams: { limit: 100, launch_status: this.launchStatus },
    });
    this.sapceXData.getLaunches(this.launchStatus).subscribe((data) => {
      this.launches = data;
      this.launchesCount = data.length;
    });
  }

  filter_land(event) {
    this.landstatus = event.target.textContent.toLowerCase();

    if (this.launchStatus != "" && this.landstatus != "" && this.year == "") {
      this.sapceXData
        .getLaunchLand(this.launchStatus, this.landstatus)
        .subscribe((data) => {
          this.launches = data;
          this.launchesCount = data.length;
          this._router.navigate([""], {
            queryParams: {
              limit: 100,
              launch_status: this.launchStatus,
              land_status: this.landstatus,
            },
          });
        });
    } else if (
      this.launchStatus != "" &&
      this.landstatus != "" &&
      this.year != ""
    ) {
      this.sapceXData
        .getAll(this.year, this.launchStatus, this.landstatus)
        .subscribe((data) => {
          this.launches = data;
          this.launchesCount = data.length;
          this._router.navigate([""], {
            queryParams: {
              limit: 100,
              launch_status: this.launchStatus,
              land_status: this.landstatus,
              launch_year: this.year,
            },
          });
          return;
        });
    } else {
      this.sapceXData
        .getLaunches_Land(this.landstatus)
        .subscribe((data) => {
          this.launches = data;
          this.launchesCount = data.length;
          return;
        });
    }
  }

  filterYear(year) {
    this.year = year;
    this._router.navigate([""], {
      queryParams: { limit: 100, year: this.year },
    });
    this.sapceXData.getYear(this.year).subscribe((data) => {
      this.launches = data;
    });
  }
}
